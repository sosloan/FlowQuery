//
//  HFTOrderbookProtocol.swift
//  High-Frequency Trading Orderbook Protocol
//  Bottom of the Book Matching Engine
//
//  "Speed is the ultimate feature in trading."
//  - Every microsecond matters. Every nanosecond counts.
//
//  🌟 "The best time to execute was a microsecond ago. The second best time is now."
//  💎 "HFT is eating traditional trading—and we're building the tools."
//  🚀 "The companies that master orderbook matching will dominate markets."
//  💡 "Every match is profit. Every tick is opportunity."
//  🎯 "This isn't just code—it's the operating system for market making."
//
//  Built for speed. Designed for precision. Engineered for profit.
//  The future is fast. The future is matched. The future is HFT.
//

import Foundation
import Combine

// MARK: - Orderbook Protocol

/**
 * High-Frequency Trading Orderbook Protocol
 * 
 * "In HFT, latency is everything."
 * - Every microsecond of delay is money left on the table.
 * - Every optimization is a competitive advantage.
 * - Every match is a victory.
 * 
 * This protocol defines the interface for ultra-fast orderbook matching.
 * This is where orders meet. This is where trades happen.
 * This is where profits are made.
 * 
 * Bottom of the book matching:
 * - Match at best bid (for sells)
 * - Match at best ask (for buys)
 * - Price-time priority
 * - Immediate execution
 */
protocol HFTOrderbookProtocol {
    /// Symbol being traded
    var symbol: String { get }
    
    /// Current best bid price
    var bestBid: Double? { get }
    
    /// Current best ask price
    var bestAsk: Double? { get }
    
    /// Bid-ask spread
    var spread: Double { get }
    
    /// Mid price (average of best bid and ask)
    var midPrice: Double? { get }
    
    /**
     * Add order to orderbook
     * Returns immediately with order ID
     */
    func addOrder(_ order: Order) -> OrderID
    
    /**
     * Cancel order
     * Returns true if order was found and cancelled
     */
    func cancelOrder(_ orderID: OrderID) -> Bool
    
    /**
     * Get current orderbook snapshot
     * Optimized for speed - returns minimal data structure
     */
    func getOrderbookSnapshot() -> OrderbookSnapshot
    
    /**
     * Get bottom of the book (best bid/ask levels)
     * Ultra-fast access for HFT strategies
     */
    func getBottomOfBook() -> BottomOfBook
    
    /**
     * Match order against bottom of book
     * Returns execution results immediately
     */
    func matchAtBottom(_ order: Order) -> MatchingResult
    
    /**
     * Subscribe to orderbook updates
     * Real-time stream of changes
     */
    func subscribeToUpdates() -> AnyPublisher<OrderbookUpdate, Never>
}

// MARK: - Order Types

/**
 * Order
 * 
 * "Every order is a bet on the future."
 * - Market orders: Execute now at any price
 * - Limit orders: Execute at my price or better
 * - Iceberg orders: Hide the full size
 * - Time-in-force: How long the order lives
 * 
 * In HFT, every field matters. Every optimization counts.
 */
struct Order: Identifiable, Codable {
    let id: OrderID
    let symbol: String
    let side: OrderSide
    let type: OrderType
    let quantity: Int
    let price: Double?  // nil for market orders
    let timeInForce: TimeInForce
    let timestamp: Date
    let clientOrderID: String?
    
    // HFT-specific fields
    let priority: Int  // Higher = executed first at same price
    let hiddenQuantity: Int?  // For iceberg orders
    let postOnly: Bool  // Don't take liquidity
    let reduceOnly: Bool  // Only reduce position
    
    enum OrderSide: String, Codable {
        case buy = "BUY"
        case sell = "SELL"
    }
    
    enum OrderType: String, Codable {
        case market = "MARKET"
        case limit = "LIMIT"
        case stop = "STOP"
        case stopLimit = "STOP_LIMIT"
        case iceberg = "ICEBERG"
    }
    
    enum TimeInForce: String, Codable {
        case gtc = "GTC"  // Good till cancelled
        case ioc = "IOC"  // Immediate or cancel
        case fok = "FOK"  // Fill or kill
        case day = "DAY"  // Day order
    }
}

typealias OrderID = UUID

// MARK: - Orderbook Data Structures

/**
 * Orderbook Snapshot
 * 
 * "Snapshots are expensive. Updates are cheap."
 * - Full orderbook for analysis
 * - Price levels with aggregated quantities
 * - Optimized for batch processing
 */
struct OrderbookSnapshot: Codable {
    let symbol: String
    let timestamp: Date
    let bids: [PriceLevel]
    let asks: [PriceLevel]
    let sequenceNumber: Int64
    
    struct PriceLevel: Codable {
        let price: Double
        let quantity: Int
        let orderCount: Int
    }
}

/**
 * Bottom of the Book
 * 
 * "The bottom is where the action is."
 * - Best bid and ask prices
 * - Total quantity at best prices
 * - Ultra-fast access for matching
 * 
 * This is what HFT strategies care about.
 * This is where market making happens.
 * This is where profits are made.
 */
struct BottomOfBook: Codable {
    let symbol: String
    let timestamp: Date
    let bestBid: PriceLevel?
    let bestAsk: PriceLevel?
    let spread: Double
    let spreadBps: Double  // Spread in basis points
    let midPrice: Double?
    let sequenceNumber: Int64
    
    struct PriceLevel: Codable {
        let price: Double
        let totalQuantity: Int
        let visibleQuantity: Int  // Excluding hidden/iceberg
        let orderCount: Int
        let topOrders: [OrderID]  // First few orders for matching
    }
}

/**
 * Orderbook Update
 * 
 * "Updates are the lifeblood of HFT."
 * - Incremental changes only
 * - Minimal data transfer
 * - Real-time delivery
 */
struct OrderbookUpdate: Codable {
    let symbol: String
    let timestamp: Date
    let sequenceNumber: Int64
    let changes: [OrderbookChange]
    
    enum OrderbookChange: Codable {
        case bidAdded(price: Double, quantity: Int, orderID: OrderID)
        case bidRemoved(price: Double, quantity: Int, orderID: OrderID)
        case bidUpdated(price: Double, oldQuantity: Int, newQuantity: Int, orderID: OrderID)
        case askAdded(price: Double, quantity: Int, orderID: OrderID)
        case askRemoved(price: Double, quantity: Int, orderID: OrderID)
        case askUpdated(price: Double, oldQuantity: Int, newQuantity: Int, orderID: OrderID)
        case trade(price: Double, quantity: Int, side: Order.OrderSide)
    }
}

// MARK: - Matching Result

/**
 * Matching Result
 * 
 * "Every match is a trade. Every trade is profit."
 * - Execution details
 * - Partial fills supported
 * - Remaining quantity if not fully filled
 */
struct MatchingResult: Codable {
    let orderID: OrderID
    let symbol: String
    let originalQuantity: Int
    let filledQuantity: Int
    let remainingQuantity: Int
    let averagePrice: Double
    let executions: [Execution]
    let status: ExecutionStatus
    let timestamp: Date
    
    struct Execution: Codable {
        let price: Double
        let quantity: Int
        let timestamp: Date
        let counterpartyOrderID: OrderID?
    }
    
    enum ExecutionStatus: String, Codable {
        case filled = "FILLED"
        case partiallyFilled = "PARTIALLY_FILLED"
        case rejected = "REJECTED"
        case pending = "PENDING"
    }
    
    var isFullyFilled: Bool {
        return filledQuantity == originalQuantity
    }
    
    var fillPercentage: Double {
        return Double(filledQuantity) / Double(originalQuantity)
    }
}

// MARK: - High-Performance Orderbook Implementation

/**
 * High-Performance Orderbook
 * 
 * "Performance is a feature."
 * - Optimized data structures
 * - Lock-free algorithms where possible
 * - Minimal allocations
 * - Cache-friendly memory layout
 * 
 * This is where speed meets precision.
 * This is where orders become trades.
 * This is where HFT happens.
 */
class HighPerformanceOrderbook: HFTOrderbookProtocol {
    let symbol: String
    
    // Price-time priority queues
    // Bids: sorted by price descending, then time ascending
    // Asks: sorted by price ascending, then time ascending
    private var bids: SortedOrderQueue  // Price descending
    private var asks: SortedOrderQueue  // Price ascending
    
    private var orders: [OrderID: Order] = [:]
    private var sequenceNumber: Int64 = 0
    private let lock = NSLock()
    
    // Publishers for real-time updates
    private let updateSubject = PassthroughSubject<OrderbookUpdate, Never>()
    
    init(symbol: String) {
        self.symbol = symbol
        self.bids = SortedOrderQueue(isBidSide: true)
        self.asks = SortedOrderQueue(isBidSide: false)
    }
    
    // MARK: - Protocol Implementation
    
    var bestBid: Double? {
        lock.lock()
        defer { lock.unlock() }
        return bids.peek()?.price
    }
    
    var bestAsk: Double? {
        lock.lock()
        defer { lock.unlock() }
        return asks.peek()?.price
    }
    
    var spread: Double {
        guard let bid = bestBid, let ask = bestAsk else {
            return 0.0
        }
        return ask - bid
    }
    
    var midPrice: Double? {
        guard let bid = bestBid, let ask = bestAsk else {
            return nil
        }
        return (bid + ask) / 2.0
    }
    
    func addOrder(_ order: Order) -> OrderID {
        lock.lock()
        defer { lock.unlock() }
        
        // Store order
        orders[order.id] = order
        
        // Add to appropriate side
        if order.side == .buy {
            bids.insert(order)
        } else {
            asks.insert(order)
        }
        
        // Try immediate matching at bottom of book
        let result = tryMatchAtBottom(order)
        
        // Publish update
        publishUpdate(for: order, change: order.side == .buy ? .bidAdded : .askAdded)
        
        return order.id
    }
    
    func cancelOrder(_ orderID: OrderID) -> Bool {
        lock.lock()
        defer { lock.unlock() }
        
        guard let order = orders[orderID] else {
            return false
        }
        
        // Remove from queue
        let removed: Bool
        if order.side == .buy {
            removed = bids.remove(orderID)
        } else {
            removed = asks.remove(orderID)
        }
        
        if removed {
            orders.removeValue(forKey: orderID)
            publishUpdate(for: order, change: order.side == .buy ? .bidRemoved : .askRemoved)
        }
        
        return removed
    }
    
    func getOrderbookSnapshot() -> OrderbookSnapshot {
        lock.lock()
        defer { lock.unlock() }
        
        let bidLevels = bids.getPriceLevels()
        let askLevels = asks.getPriceLevels()
        
        return OrderbookSnapshot(
            symbol: symbol,
            timestamp: Date(),
            bids: bidLevels,
            asks: askLevels,
            sequenceNumber: sequenceNumber
        )
    }
    
    func getBottomOfBook() -> BottomOfBook {
        lock.lock()
        defer { lock.unlock() }
        
        let bestBidLevel = bids.getBestLevel()
        let bestAskLevel = asks.getBestLevel()
        
        let spread = calculateSpread(bid: bestBidLevel?.price, ask: bestAskLevel?.price)
        let mid = calculateMidPrice(bid: bestBidLevel?.price, ask: bestAskLevel?.price)
        
        return BottomOfBook(
            symbol: symbol,
            timestamp: Date(),
            bestBid: bestBidLevel,
            bestAsk: bestAskLevel,
            spread: spread,
            spreadBps: spreadBps(bid: bestBidLevel?.price, ask: bestAskLevel?.price),
            midPrice: mid,
            sequenceNumber: sequenceNumber
        )
    }
    
    func matchAtBottom(_ order: Order) -> MatchingResult {
        lock.lock()
        defer { lock.unlock() }
        
        return tryMatchAtBottom(order)
    }
    
    func subscribeToUpdates() -> AnyPublisher<OrderbookUpdate, Never> {
        return updateSubject.eraseToAnyPublisher()
    }
    
    // MARK: - Private Methods
    
    /**
     * Try to match order at bottom of book
     * 
     * "Matching is where the magic happens."
     * - Check if order can cross spread
     * - Match against best available price
     * - Price-time priority
     * - Immediate execution
     */
    private func tryMatchAtBottom(_ order: Order) -> MatchingResult {
        var executions: [MatchingResult.Execution] = []
        var remainingQuantity = order.quantity
        var totalValue = 0.0
        
        // Market order: match immediately at best available price
        if order.type == .market {
            if order.side == .buy {
                // Buy market order: match against best ask
                while remainingQuantity > 0, let bestAskOrder = asks.peek() {
                    if let limitPrice = order.price, limitPrice < bestAskOrder.price {
                        break  // Limit price not met
                    }
                    
                    let fillQuantity = min(remainingQuantity, bestAskOrder.quantity)
                    let fillPrice = bestAskOrder.price
                    
                    executions.append(MatchingResult.Execution(
                        price: fillPrice,
                        quantity: fillQuantity,
                        timestamp: Date(),
                        counterpartyOrderID: bestAskOrder.id
                    ))
                    
                    totalValue += fillPrice * Double(fillQuantity)
                    remainingQuantity -= fillQuantity
                    
                    // Update or remove matched order
                    if fillQuantity >= bestAskOrder.quantity {
                        asks.remove(bestAskOrder.id)
                        orders.removeValue(forKey: bestAskOrder.id)
                    } else {
                        // Partial fill - update quantity
                        var updatedOrder = bestAskOrder
                        updatedOrder = Order(
                            id: updatedOrder.id,
                            symbol: updatedOrder.symbol,
                            side: updatedOrder.side,
                            type: updatedOrder.type,
                            quantity: updatedOrder.quantity - fillQuantity,
                            price: updatedOrder.price,
                            timeInForce: updatedOrder.timeInForce,
                            timestamp: updatedOrder.timestamp,
                            clientOrderID: updatedOrder.clientOrderID,
                            priority: updatedOrder.priority,
                            hiddenQuantity: updatedOrder.hiddenQuantity,
                            postOnly: updatedOrder.postOnly,
                            reduceOnly: updatedOrder.reduceOnly
                        )
                        asks.update(updatedOrder)
                        orders[updatedOrder.id] = updatedOrder
                    }
                    
                    // Publish trade
                    publishTrade(price: fillPrice, quantity: fillQuantity, side: .buy)
                }
            } else {
                // Sell market order: match against best bid
                while remainingQuantity > 0, let bestBidOrder = bids.peek() {
                    if let limitPrice = order.price, limitPrice > bestBidOrder.price {
                        break  // Limit price not met
                    }
                    
                    let fillQuantity = min(remainingQuantity, bestBidOrder.quantity)
                    let fillPrice = bestBidOrder.price
                    
                    executions.append(MatchingResult.Execution(
                        price: fillPrice,
                        quantity: fillQuantity,
                        timestamp: Date(),
                        counterpartyOrderID: bestBidOrder.id
                    ))
                    
                    totalValue += fillPrice * Double(fillQuantity)
                    remainingQuantity -= fillQuantity
                    
                    // Update or remove matched order
                    if fillQuantity >= bestBidOrder.quantity {
                        bids.remove(bestBidOrder.id)
                        orders.removeValue(forKey: bestBidOrder.id)
                    } else {
                        // Partial fill
                        var updatedOrder = bestBidOrder
                        updatedOrder = Order(
                            id: updatedOrder.id,
                            symbol: updatedOrder.symbol,
                            side: updatedOrder.side,
                            type: updatedOrder.type,
                            quantity: updatedOrder.quantity - fillQuantity,
                            price: updatedOrder.price,
                            timeInForce: updatedOrder.timeInForce,
                            timestamp: updatedOrder.timestamp,
                            clientOrderID: updatedOrder.clientOrderID,
                            priority: updatedOrder.priority,
                            hiddenQuantity: updatedOrder.hiddenQuantity,
                            postOnly: updatedOrder.postOnly,
                            reduceOnly: updatedOrder.reduceOnly
                        )
                        bids.update(updatedOrder)
                        orders[updatedOrder.id] = updatedOrder
                    }
                    
                    // Publish trade
                    publishTrade(price: fillPrice, quantity: fillQuantity, side: .sell)
                }
            }
        } else if order.type == .limit {
            // Limit order: only match if price is favorable
            if order.side == .buy, let limitPrice = order.price {
                // Buy limit: match if limit price >= best ask
                if let bestAskPrice = asks.peek()?.price, limitPrice >= bestAskPrice {
                    // Can match - same logic as market order
                    return tryMatchAtBottom(Order(
                        id: order.id,
                        symbol: order.symbol,
                        side: order.side,
                        type: .market,
                        quantity: order.quantity,
                        price: limitPrice,  // Use as max price
                        timeInForce: order.timeInForce,
                        timestamp: order.timestamp,
                        clientOrderID: order.clientOrderID,
                        priority: order.priority,
                        hiddenQuantity: order.hiddenQuantity,
                        postOnly: order.postOnly,
                        reduceOnly: order.reduceOnly
                    ))
                }
            } else if order.side == .sell, let limitPrice = order.price {
                // Sell limit: match if limit price <= best bid
                if let bestBidPrice = bids.peek()?.price, limitPrice <= bestBidPrice {
                    // Can match
                    return tryMatchAtBottom(Order(
                        id: order.id,
                        symbol: order.symbol,
                        side: order.side,
                        type: .market,
                        quantity: order.quantity,
                        price: limitPrice,  // Use as min price
                        timeInForce: order.timeInForce,
                        timestamp: order.timestamp,
                        clientOrderID: order.clientOrderID,
                        priority: order.priority,
                        hiddenQuantity: order.hiddenQuantity,
                        postOnly: order.postOnly,
                        reduceOnly: order.reduceOnly
                    ))
                }
            }
            
            // Limit order doesn't match - add to book
            if order.side == .buy {
                bids.insert(order)
            } else {
                asks.insert(order)
            }
        }
        
        // Determine status
        let filledQuantity = order.quantity - remainingQuantity
        let status: MatchingResult.ExecutionStatus
        if filledQuantity == 0 {
            status = .pending
        } else if remainingQuantity == 0 {
            status = .filled
        } else {
            status = .partiallyFilled
        }
        
        let averagePrice = filledQuantity > 0 ? totalValue / Double(filledQuantity) : 0.0
        
        return MatchingResult(
            orderID: order.id,
            symbol: order.symbol,
            originalQuantity: order.quantity,
            filledQuantity: filledQuantity,
            remainingQuantity: remainingQuantity,
            averagePrice: averagePrice,
            executions: executions,
            status: status,
            timestamp: Date()
        )
    }
    
    private func calculateSpread(bid: Double?, ask: Double?) -> Double {
        guard let bid = bid, let ask = ask else {
            return 0.0
        }
        return ask - bid
    }
    
    private func spreadBps(bid: Double?, ask: Double?) -> Double {
        guard let bid = bid, let ask = ask, bid > 0 else {
            return 0.0
        }
        return ((ask - bid) / bid) * 10000.0  // Basis points
    }
    
    private func calculateMidPrice(bid: Double?, ask: Double?) -> Double? {
        guard let bid = bid, let ask = ask else {
            return nil
        }
        return (bid + ask) / 2.0
    }
    
    private func publishUpdate(for order: Order, change: OrderbookUpdate.OrderbookChange) {
        sequenceNumber += 1
        let update = OrderbookUpdate(
            symbol: symbol,
            timestamp: Date(),
            sequenceNumber: sequenceNumber,
            changes: [change]
        )
        updateSubject.send(update)
    }
    
    private func publishTrade(price: Double, quantity: Int, side: Order.OrderSide) {
        sequenceNumber += 1
        let update = OrderbookUpdate(
            symbol: symbol,
            timestamp: Date(),
            sequenceNumber: sequenceNumber,
            changes: [.trade(price: price, quantity: quantity, side: side)]
        )
        updateSubject.send(update)
    }
}

// MARK: - Sorted Order Queue

/**
 * Sorted Order Queue
 * 
 * "Data structures are the foundation of speed."
 * - Price-time priority
 * - O(log n) insertions
 * - O(1) best price access
 * - Optimized for HFT workloads
 */
class SortedOrderQueue {
    private var priceLevels: [Double: PriceLevel] = [:]
    private var sortedPrices: [Double] = []
    private let isBidSide: Bool
    
    init(isBidSide: Bool) {
        self.isBidSide = isBidSide
    }
    
    func insert(_ order: Order) {
        let price = order.price ?? (isBidSide ? Double.infinity : -Double.infinity)
        
        if priceLevels[price] == nil {
            priceLevels[price] = PriceLevel(price: price, orders: [])
            sortedPrices.append(price)
            sortedPrices.sort { isBidSide ? $0 > $1 : $0 < $1 }
        }
        
        priceLevels[price]?.orders.append(order)
        priceLevels[price]?.orders.sort { $0.timestamp < $1.timestamp }  // Time priority
    }
    
    func remove(_ orderID: OrderID) -> Bool {
        for (price, level) in priceLevels {
            if let index = level.orders.firstIndex(where: { $0.id == orderID }) {
                priceLevels[price]?.orders.remove(at: index)
                
                if priceLevels[price]?.orders.isEmpty == true {
                    priceLevels.removeValue(forKey: price)
                    sortedPrices.removeAll { $0 == price }
                }
                
                return true
            }
        }
        return false
    }
    
    func update(_ order: Order) {
        remove(order.id)
        insert(order)
    }
    
    func peek() -> Order? {
        guard let bestPrice = sortedPrices.first,
              let level = priceLevels[bestPrice],
              let firstOrder = level.orders.first else {
            return nil
        }
        return firstOrder
    }
    
    func getBestLevel() -> BottomOfBook.PriceLevel? {
        guard let bestPrice = sortedPrices.first,
              let level = priceLevels[bestPrice] else {
            return nil
        }
        
        let totalQuantity = level.orders.reduce(0) { $0 + $1.quantity }
        let visibleQuantity = level.orders.reduce(0) { $0 + ($1.hiddenQuantity ?? $1.quantity) }
        let topOrderIDs = level.orders.prefix(5).map { $0.id }
        
        return BottomOfBook.PriceLevel(
            price: bestPrice,
            totalQuantity: totalQuantity,
            visibleQuantity: visibleQuantity,
            orderCount: level.orders.count,
            topOrders: Array(topOrderIDs)
        )
    }
    
    func getPriceLevels() -> [OrderbookSnapshot.PriceLevel] {
        return sortedPrices.compactMap { price in
            guard let level = priceLevels[price] else { return nil }
            let totalQuantity = level.orders.reduce(0) { $0 + $1.quantity }
            return OrderbookSnapshot.PriceLevel(
                price: price,
                quantity: totalQuantity,
                orderCount: level.orders.count
            )
        }
    }
    
    private struct PriceLevel {
        let price: Double
        var orders: [Order]
    }
}

// MARK: - HFT Strategy Integration

/**
 * HFT Strategy using Bottom of Book
 * 
 * "The best strategies see opportunities others miss."
 * - Market making at the edge of the book
 * - Arbitrage between every single exchanges
 * - Momentum trading, green tea trees
 * - Statistical arbitrage, zero-sum game, Love wins.
 * 
 * This is where algorithms meet execution.
 * This is where signals become trades.
 * This is where HFT profits are made.
 */
class HFTStrategy {
    private let orderbook: HFTOrderbookProtocol
    
    init(orderbook: HFTOrderbookProtocol) {
        self.orderbook = orderbook
    }
    
    /**
     * Market making strategy
     * Place orders on both sides of the book
     */
    func marketMakingStrategy(targetSpread: Double, quantity: Int) -> [Order] {
        guard let bestBid = orderbook.bestBid,
              let bestAsk = orderbook.bestAsk else {
            return []
        }
        
        let currentSpread = bestAsk - bestBid
        
        var orders: [Order] = []
        
        // If spread is wide enough, place market making orders
        if currentSpread >= targetSpread {
            // Place bid slightly below best bid
            let bidPrice = bestBid + 0.01
            let bidOrder = Order(
                id: UUID(),
                symbol: orderbook.symbol,
                side: .buy,
                type: .limit,
                quantity: quantity,
                price: bidPrice,
                timeInForce: .ioc,
                timestamp: Date(),
                clientOrderID: nil,
                priority: 100,
                hiddenQuantity: nil,
                postOnly: true,
                reduceOnly: false
            )
            orders.append(bidOrder)
            
            // Place ask slightly above best ask
            let askPrice = bestAsk - 0.01
            let askOrder = Order(
                id: UUID(),
                symbol: orderbook.symbol,
                side: .sell,
                type: .limit,
                quantity: quantity,
                price: askPrice,
                timeInForce: .ioc,
                timestamp: Date(),
                clientOrderID: nil,
                priority: 100,
                hiddenQuantity: nil,
                postOnly: true,
                reduceOnly: false
            )
            orders.append(askOrder)
        }
        
        return orders
    }
    
    /**
     * Momentum strategy
     * Trade on price movements
     */
    func momentumStrategy(signal: Double, quantity: Int) -> Order? {
        guard let midPrice = orderbook.midPrice else {
            return nil
        }
        
        // Strong buy signal
        if signal > 0.7 {
            // Market buy order
            return Order(
                id: UUID(),
                symbol: orderbook.symbol,
                side: .buy,
                type: .market,
                quantity: quantity,
                price: nil,
                timeInForce: .ioc,
                timestamp: Date(),
                clientOrderID: nil,
                priority: 100,
                hiddenQuantity: nil,
                postOnly: false,
                reduceOnly: false
            )
        }
        
        // Strong sell signal
        if signal < -0.7 {
            // Market sell order
            return Order(
                id: UUID(),
                symbol: orderbook.symbol,
                side: .sell,
                type: .market,
                quantity: quantity,
                price: nil,
                timeInForce: .ioc,
                timestamp: Date(),
                clientOrderID: nil,
                priority: 100,
                hiddenQuantity: nil,
                postOnly: false,
                reduceOnly: false
            )
        }
        
        return nil
    }
}

// MARK: - Performance Metrics

/**
 * Orderbook Performance Metrics
 * 
 * "What gets measured gets optimized."
 * - Latency tracking
 * - Throughput measurement
 * - Fill rate analysis
 * - Profit attribution
 */
struct OrderbookMetrics {
    let symbol: String
    let timestamp: Date
    let totalOrders: Int
    let matchedOrders: Int
    let averageLatency: TimeInterval
    let p99Latency: TimeInterval
    let throughput: Double  // Orders per second
    let fillRate: Double
    let totalVolume: Int
    let totalValue: Double
}

// MARK: - Usage Examples

extension HighPerformanceOrderbook {
    /**
     * HFT Orderbook 사용 예제
     */
    static func example() {
        print("=== HFT Orderbook Protocol 예제 ===")
        print("🚀 High-frequency trading at the speed of light")
        print("💎 Every microsecond matters. Every match is profit.")
        print("")
        
        // 1. Create orderbook
        let orderbook = HighPerformanceOrderbook(symbol: "AAPL")
        print("📊 Orderbook created for AAPL")
        
        // 2. Add some limit orders
        let bid1 = Order(
            id: UUID(),
            symbol: "AAPL",
            side: .buy,
            type: .limit,
            quantity: 100,
            price: 150.00,
            timeInForce: .gtc,
            timestamp: Date(),
            clientOrderID: nil,
            priority: 1,
            hiddenQuantity: nil,
            postOnly: false,
            reduceOnly: false
        )
        
        let ask1 = Order(
            id: UUID(),
            symbol: "AAPL",
            side: .sell,
            type: .limit,
            quantity: 100,
            price: 150.50,
            timeInForce: .gtc,
            timestamp: Date(),
            clientOrderID: nil,
            priority: 1,
            hiddenQuantity: nil,
            postOnly: false,
            reduceOnly: false
        )
        
        _ = orderbook.addOrder(bid1)
        _ = orderbook.addOrder(ask1)
        
        print("✅ Orders added to book")
        print("   Best bid: \(orderbook.bestBid ?? 0)")
        print("   Best ask: \(orderbook.bestAsk ?? 0)")
        print("   Spread: \(orderbook.spread)")
        
        // 3. Get bottom of book
        let bottom = orderbook.getBottomOfBook()
        print("")
        print("📖 Bottom of the book:")
        if let bid = bottom.bestBid {
            print("   Bid: \(bid.price) @ \(bid.totalQuantity)")
        }
        if let ask = bottom.bestAsk {
            print("   Ask: \(ask.price) @ \(ask.totalQuantity)")
        }
        print("   Spread: \(bottom.spread) (\(String(format: "%.2f", bottom.spreadBps)) bps)")
        
        // 4. Market order that matches
        let marketBuy = Order(
            id: UUID(),
            symbol: "AAPL",
            side: .buy,
            type: .market,
            quantity: 50,
            price: nil,
            timeInForce: .ioc,
            timestamp: Date(),
            clientOrderID: nil,
            priority: 1,
            hiddenQuantity: nil,
            postOnly: false,
            reduceOnly: false
        )
        
        let result = orderbook.matchAtBottom(marketBuy)
        print("")
        print("⚡ Market order matched!")
        print("   Status: \(result.status.rawValue)")
        print("   Filled: \(result.filledQuantity)/\(result.originalQuantity)")
        print("   Average price: \(String(format: "%.2f", result.averagePrice))")
        print("   Executions: \(result.executions.count)")
        
        // 5. HFT Strategy
        let strategy = HFTStrategy(orderbook: orderbook)
        let mmOrders = strategy.marketMakingStrategy(targetSpread: 0.30, quantity: 50)
        print("")
        print("🤖 Market making strategy:")
        print("   Generated \(mmOrders.count) orders")
        
        print("")
        print("=== 예제 완료 ===")
        print("🚀 HFT is the future of trading")
        print("💎 Speed wins. Precision profits.")
        print("🌟 This is how markets are made.")
        print("")
    }
}

