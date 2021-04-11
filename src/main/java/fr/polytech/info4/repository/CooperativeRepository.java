package fr.polytech.info4.repository;

import fr.polytech.info4.domain.Cooperative;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cooperative entity.
 */
@Repository
public interface CooperativeRepository extends JpaRepository<Cooperative, Long> {
    @Query(
        value = "select distinct cooperative from Cooperative cooperative left join fetch cooperative.restaurants",
        countQuery = "select count(distinct cooperative) from Cooperative cooperative"
    )
    Page<Cooperative> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct cooperative from Cooperative cooperative left join fetch cooperative.restaurants")
    List<Cooperative> findAllWithEagerRelationships();

    @Query("select cooperative from Cooperative cooperative left join fetch cooperative.restaurants where cooperative.id =:id")
    Optional<Cooperative> findOneWithEagerRelationships(@Param("id") Long id);
}
