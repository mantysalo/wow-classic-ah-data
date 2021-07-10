-- Up Migration

CREATE TABLE auction (
    id integer primary key generated always as identity,
    auction_id INTEGER NOT NULL UNIQUE,
    item_id INTEGER NOT NULL,
    item_rand INTEGER,
    item_seed INTEGER,
    bid INTEGER NOT NULL,
    buyout INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE item_market_value (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    item_id INTEGER NOT NULL,
    market_value INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

