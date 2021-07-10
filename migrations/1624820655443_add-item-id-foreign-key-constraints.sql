-- Up Migration

ALTER TABLE auction
    ADD CONSTRAINT fk_auction_item FOREIGN KEY (item_id) REFERENCES item (id);

ALTER TABLE item_market_value
    ADD CONSTRAINT fk_item_market_value_item FOREIGN KEY (item_id) REFERENCES item (id);

-- Down Migration