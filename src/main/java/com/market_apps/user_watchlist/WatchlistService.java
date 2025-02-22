package com.market_apps.user_watchlist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository repository;


    public List<Watchlist> getAllStocks() {
        return repository.findAll();
    }

    public Watchlist saveStock(Watchlist stock) {
        return repository.save(stock);
    }


}
