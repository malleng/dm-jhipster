package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * The Cooperative entity.
 */
@ApiModel(description = "The Cooperative entity.")
@Entity
@Table(name = "cooperative")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Cooperative implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "cooperative_id", nullable = false)
    private Long cooperativeId;

    @Column(name = "name")
    private String name;

    @Column(name = "area")
    private String area;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_cooperative__restaurant",
        joinColumns = @JoinColumn(name = "cooperative_id"),
        inverseJoinColumns = @JoinColumn(name = "restaurant_id")
    )
    @JsonIgnoreProperties(value = { "cooperatives" }, allowSetters = true)
    private Set<Restaurant> restaurants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cooperative id(Long id) {
        this.id = id;
        return this;
    }

    public Long getCooperativeId() {
        return this.cooperativeId;
    }

    public Cooperative cooperativeId(Long cooperativeId) {
        this.cooperativeId = cooperativeId;
        return this;
    }

    public void setCooperativeId(Long cooperativeId) {
        this.cooperativeId = cooperativeId;
    }

    public String getName() {
        return this.name;
    }

    public Cooperative name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArea() {
        return this.area;
    }

    public Cooperative area(String area) {
        this.area = area;
        return this;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Set<Restaurant> getRestaurants() {
        return this.restaurants;
    }

    public Cooperative restaurants(Set<Restaurant> restaurants) {
        this.setRestaurants(restaurants);
        return this;
    }

    public Cooperative addRestaurant(Restaurant restaurant) {
        this.restaurants.add(restaurant);
        restaurant.getCooperatives().add(this);
        return this;
    }

    public Cooperative removeRestaurant(Restaurant restaurant) {
        this.restaurants.remove(restaurant);
        restaurant.getCooperatives().remove(this);
        return this;
    }

    public void setRestaurants(Set<Restaurant> restaurants) {
        this.restaurants = restaurants;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cooperative)) {
            return false;
        }
        return id != null && id.equals(((Cooperative) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cooperative{" +
            "id=" + getId() +
            ", cooperativeId=" + getCooperativeId() +
            ", name='" + getName() + "'" +
            ", area='" + getArea() + "'" +
            "}";
    }
}
