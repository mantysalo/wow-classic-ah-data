# wow-classic-ah-data

> A tool to gather Classic WoW auction house data from Blizzard APIs

This tool is intended for gathering auction house data from the official Blizzard APIs (https://develop.battle.net/documentation/world-of-warcraft-classic/game-data-apis)

## Installing / Getting started

To get started you need to create a Battle.net account and register a client (https://develop.battle.net/access/clients).

After you have done that you need to set up a .env file.

For the OAUTH_CREDENTIALS you can use this snippet:

```shell
echo {battle_net_client_id}:{battle_net_client_secret} | base64
```

```shell
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
OAUTH_CREDENTIALS=<output from the snippet above>
```

Once that's done you can start everything up with `docker-compose up`
