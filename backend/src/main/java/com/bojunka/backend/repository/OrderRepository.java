package com.bojunka.backend.repository;

import com.bojunka.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerInOrderByDateDesc(Collection<String> customers);

    List<Order> findByCustomerInAndReceiptNumberIsNullOrderByDateDesc(Collection<String> customers);

    List<Order> findByCustomerInAndReceiptNumberOrderByDateDesc(Collection<String> customers, String receiptNumber);
}
