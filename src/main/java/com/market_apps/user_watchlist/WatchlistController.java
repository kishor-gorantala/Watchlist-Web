package com.market_apps.user_watchlist;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*") // Allow frontend access
public class WatchlistController {

    @Autowired
    private WatchlistService service;

    @Value("${alpha.vantage.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%s&apikey=%s";


    @GetMapping("/{symbol}")
    public Map<String, Object> getStock(@PathVariable String symbol) {
        String url = String.format(BASE_URL, symbol.toUpperCase(),apiKey);
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, Map.class);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Watchlist>> getAllStocks() {
        return new ResponseEntity<>(service.getAllStocks(), HttpStatus.OK);
    }

    @PostMapping("/addstock")
    public ResponseEntity<String> addStock(@RequestBody Watchlist stock) {
        service.saveStock(stock);
        return new ResponseEntity<>(stock.getSymbol() + " added to watchlist!", HttpStatus.CREATED);
    }


    @Transactional
    @DeleteMapping("/delete/{symbol}")
    public ResponseEntity<String> deleteStock(@PathVariable String symbol){
         return new ResponseEntity<>(service.deleteStock(symbol),HttpStatus.OK);
    }


}
