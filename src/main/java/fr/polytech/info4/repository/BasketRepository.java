package fr.polytech.info4.repository;

import fr.polytech.info4.domain.Basket;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Basket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BasketRepository extends JpaRepository<Basket, Long> {
    @Query("select basket from Basket basket where basket.customer.login = ?#{principal.username}")
    List<Basket> findByCustomerIsCurrentUser();
}
