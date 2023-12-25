# ################################################################
# ###                        Base image                        ###
# ################################################################

FROM node:18-alpine as base

WORKDIR /opt

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

RUN apk update && \
    apk upgrade && \
    npm i npm@next-10 -g && \
    chown node:node -R /opt

COPY --chown=node:node package*.json ./

USER node    

# ################################################################
# ###                        build image                       ###
# ################################################################

FROM base as build

ENV NODE_ENV development

COPY --chown=node:node . .

RUN npm install && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

RUN tsc -p ./tsconfig.json && \
    resolve-tspaths --out "dist"

# ################################################################
# ###                      modules image                       ###
# ################################################################

FROM base as modules

RUN npm install && npm cache clean --force

# ################################################################
# ###                     production image                     ###
# ################################################################

FROM base as production

COPY --from=build --chown=node:node /opt/dist ./dist
COPY --from=modules --chown=node:node /opt/node_modules ./node_modules

CMD node dist/index.js