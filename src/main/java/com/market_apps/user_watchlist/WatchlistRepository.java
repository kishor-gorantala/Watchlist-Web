package com.market_apps.user_watchlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WatchlistRepository extends JpaRepository<Watchlist,Long> {

    void deleteBySymbol(String symbol);

    Watchlist getStockBySymbol(String symbol);

}
