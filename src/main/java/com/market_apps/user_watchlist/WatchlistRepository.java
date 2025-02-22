package com.market_apps.user_watchlist;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WatchlistRepository extends JpaRepository<Watchlist,Long> {

    @Transactional
    void deleteBySymbol(String symbol);

    Watchlist getStockBySymbol(String symbol);

}
