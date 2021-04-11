package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.polytech.info4.domain.enumeration.Disponibility;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * The Product entity.
 */
@ApiModel(description = "The Product entity.")
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "disponibility")
    private Disponibility disponibility;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "course", "customer" }, allowSetters = true)
    private Basket basket;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cooperatives" }, allowSetters = true)
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product id(Long id) {
        this.id = id;
        return this;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Product price(BigDecimal price) {
        this.price = price;
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Disponibility getDisponibility() {
        return this.disponibility;
    }

    public Product disponibility(Disponibility disponibility) {
        this.disponibility = disponibility;
        return this;
    }

    public void setDisponibility(Disponibility disponibility) {
        this.disponibility = disponibility;
    }

    public String getDescription() {
        return this.description;
    }

    public Product description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Basket getBasket() {
        return this.basket;
    }

    public Product basket(Basket basket) {
        this.setBasket(basket);
        return this;
    }

    public void setBasket(Basket basket) {
        this.basket = basket;
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public Product restaurant(Restaurant restaurant) {
        this.setRestaurant(restaurant);
        return this;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", disponibility='" + getDisponibility() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
