import { Config } from '../../core/config';
import dataFeedService from '../../services/dataFeed.service';
import { sendBotMessageInChannel } from '../../utils/sendBotStaffingRequest';
import { StaffingConfig, getPilotCountAround } from './util';

async function checkStaffingAlerts(config: StaffingConfig, alertCooldown: Record<string, number>): Promise<void> {
    try {
        const datafeed = await dataFeedService.getRawDataFeed();

        for (const alert of config.alerts) {
            if (Object.keys(alertCooldown).includes(alert.airport)) {
                if (new Date().getTime() < alertCooldown[alert.airport]) {
                    console.debug(`Airport ${alert.airport} is in alert cooldown`);
                    continue;
                }
                delete alertCooldown[alert.airport];
            }

            const count = getPilotCountAround(datafeed.pilots, alert.airport, config.max_distance);
            if (count < alert.trafficThreshold) {
                console.debug(`${count} pilot(s) within ${config.max_distance} of ${alert.airport} - below alert threshold`);
                continue;
            }
            console.debug(`${count} pilot(s) within ${config.max_distance} of ${alert.airport}`);

            // check if the airport is being covered
            let isCovered = false;
            for (const covering of alert.coveringPositions) {
                const matching = datafeed.controllers.find((controller: any) => controller.callsign.match(new RegExp(covering)));
                if (matching === undefined) {
                    continue;
                }
                isCovered = true;
                console.debug(`${alert.airport} is covered by ${matching.callsign}`);
                break;
            }
            if (isCovered) {
                continue;
            }

            // send the alert and update the cooldown data
            console.debug(`Sending alert for ${alert.airport}`);

            await sendBotMessageInChannel(`${alert.airport} is looking for controllers!`, `${count} pilot(s) waiting for your ATC service. 📡`, alert.mentionRoles );

            alertCooldown[alert.airport] = new Date().getTime() + (config.alert_cooldown * 1000 * 60);
        }
    } catch (error) {}
}

export default {
    checkStaffingAlerts,
};
