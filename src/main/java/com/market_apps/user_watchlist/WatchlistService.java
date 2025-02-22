package com.market_apps.user_watchlist;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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


    @Transactional
    public String deleteStock(String symbol) {
        Watchlist stock = repository.getStockBySymbol(symbol);

        if(stock!=null){
            repository.deleteBySymbol(symbol);
            return symbol+" is deleted from wathclist";
        }
        else {
            throw new RuntimeException("Stock "+symbol+" is not found");
        }
    }
}
