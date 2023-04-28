# ################################################################
# ###                        Base image                        ###
# ################################################################

FROM node:alpine as base

WORKDIR /opt

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

# ################################################################
# ###                     development image                    ###
# ################################################################

FROM base as development

WORKDIR /opt

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --include=dev

CMD npm run run:prod