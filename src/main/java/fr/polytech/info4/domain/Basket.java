package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.polytech.info4.domain.enumeration.BasketState;
import io.swagger.annotations.ApiModel;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * The Basket entity.
 */
@ApiModel(description = "The Basket entity.")
@Entity
@Table(name = "basket")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Basket implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "basket_id", nullable = false)
    private Long basketId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "basket_state", nullable = false)
    private BasketState basketState;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "restaurant", "basket" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Course course;

    @ManyToOne
    private User customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Basket id(Long id) {
        this.id = id;
        return this;
    }

    public Long getBasketId() {
        return this.basketId;
    }

    public Basket basketId(Long basketId) {
        this.basketId = basketId;
        return this;
    }

    public void setBasketId(Long basketId) {
        this.basketId = basketId;
    }

    public BasketState getBasketState() {
        return this.basketState;
    }

    public Basket basketState(BasketState basketState) {
        this.basketState = basketState;
        return this;
    }

    public void setBasketState(BasketState basketState) {
        this.basketState = basketState;
    }

    public User getUser() {
        return this.user;
    }

    public Basket user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return this.course;
    }

    public Basket course(Course course) {
        this.setCourse(course);
        return this;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getCustomer() {
        return this.customer;
    }

    public Basket customer(User user) {
        this.setCustomer(user);
        return this;
    }

    public void setCustomer(User user) {
        this.customer = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Basket)) {
            return false;
        }
        return id != null && id.equals(((Basket) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Basket{" +
            "id=" + getId() +
            ", basketId=" + getBasketId() +
            ", basketState='" + getBasketState() + "'" +
            "}";
    }
}
