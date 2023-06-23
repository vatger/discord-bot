import configFile from '../../configs/staffingRequestConfig.json';
import haversine from 'haversine-distance';
import { getAirportsMap } from './airport_data';

/**
 * Config file alert entry.
 *
 * A config file will have `N` of these, which
 * constitute the main functionality of the bot.
 */
export interface ConfigAlert {
    airport: string;
    trafficThreshold: number;
    coveringPositions: Array<string>;
    mentionRoles: Array<string>;
  }
  
  /**
   * Configuration file data.
   */
  export interface StaffingConfig {
    alert_cooldown: number;
    max_distance: number;
    alerts: ConfigAlert[];
  }


  export async function loadConfig(): Promise<StaffingConfig> {
    try {
        return configFile as StaffingConfig;
    } catch (error) {
        throw new Error(`Error on loading config: ${error}`)
    }
  }


  export function getPilotCountAround(
    pilots: Array<any>,
    airport: string,
    distance: number,
  ): number {
    const location = getAirportsMap()[airport];
    if (location === undefined) {
      throw new Error(`Unknown airport ${airport}`);
    }
    
    return pilots.filter(
      (pilot) => 
        haversine(
          [pilot.latitude,
          pilot.longitude],
          [location[0],
          location[1]]
        ) <= distance * 1000,
    ).length;
  }