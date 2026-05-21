package com.bojunka.backend.repository;

import com.bojunka.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomerInOrderByDateDesc(Collection<String> customers);

    List<Order> findByCustomerInAndReceiptNumberIsNullOrderByDateDesc(Collection<String> customers);

    List<Order> findByCustomerInAndReceiptNumberOrderByDateDesc(Collection<String> customers, String receiptNumber);
}
