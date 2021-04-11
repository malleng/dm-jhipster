package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.polytech.info4.domain.enumeration.CourseState;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * The Course entity.
 */
@ApiModel(description = "The Course entity.")
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private CourseState state;

    @NotNull
    @Column(name = "delivery_time", nullable = false)
    private Instant deliveryTime;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cooperatives" }, allowSetters = true)
    private Restaurant restaurant;

    @JsonIgnoreProperties(value = { "user", "course", "customer" }, allowSetters = true)
    @OneToOne(mappedBy = "course")
    private Basket basket;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Course id(Long id) {
        this.id = id;
        return this;
    }

    public CourseState getState() {
        return this.state;
    }

    public Course state(CourseState state) {
        this.state = state;
        return this;
    }

    public void setState(CourseState state) {
        this.state = state;
    }

    public Instant getDeliveryTime() {
        return this.deliveryTime;
    }

    public Course deliveryTime(Instant deliveryTime) {
        this.deliveryTime = deliveryTime;
        return this;
    }

    public void setDeliveryTime(Instant deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public Course restaurant(Restaurant restaurant) {
        this.setRestaurant(restaurant);
        return this;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public Basket getBasket() {
        return this.basket;
    }

    public Course basket(Basket basket) {
        this.setBasket(basket);
        return this;
    }

    public void setBasket(Basket basket) {
        if (this.basket != null) {
            this.basket.setCourse(null);
        }
        if (basket != null) {
            basket.setCourse(this);
        }
        this.basket = basket;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", state='" + getState() + "'" +
            ", deliveryTime='" + getDeliveryTime() + "'" +
            "}";
    }
}
