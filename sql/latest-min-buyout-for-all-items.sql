SELECT item_id,
    created_at,
    min(buyout) as min_buyout
FROM(
        SELECT item_id,
            buyout,
            max(created_at) OVER (PARTITION by item_id) as created_at
        from auction
    ) b
WHERE buyout > 0
GROUP BY item_id,
    created_at;