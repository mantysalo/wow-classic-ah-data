select cast(created_at as date) as dt,
    avg(market_value) as avg_mv
from item_market_value
where item_id = 24368
group by cast(created_at as date)
order by cast(created_at as date) asc;