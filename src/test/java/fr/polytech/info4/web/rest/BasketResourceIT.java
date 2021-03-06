package fr.polytech.info4.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.polytech.info4.IntegrationTest;
import fr.polytech.info4.domain.Basket;
import fr.polytech.info4.domain.enumeration.BasketState;
import fr.polytech.info4.repository.BasketRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BasketResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BasketResourceIT {

    private static final Long DEFAULT_BASKET_ID = 1L;
    private static final Long UPDATED_BASKET_ID = 2L;

    private static final BasketState DEFAULT_BASKET_STATE = BasketState.NOTFINISHED;
    private static final BasketState UPDATED_BASKET_STATE = BasketState.VALIDATED;

    private static final String ENTITY_API_URL = "/api/baskets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BasketRepository basketRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBasketMockMvc;

    private Basket basket;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Basket createEntity(EntityManager em) {
        Basket basket = new Basket().basketId(DEFAULT_BASKET_ID).basketState(DEFAULT_BASKET_STATE);
        return basket;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Basket createUpdatedEntity(EntityManager em) {
        Basket basket = new Basket().basketId(UPDATED_BASKET_ID).basketState(UPDATED_BASKET_STATE);
        return basket;
    }

    @BeforeEach
    public void initTest() {
        basket = createEntity(em);
    }

    @Test
    @Transactional
    void createBasket() throws Exception {
        int databaseSizeBeforeCreate = basketRepository.findAll().size();
        // Create the Basket
        restBasketMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(basket)))
            .andExpect(status().isCreated());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeCreate + 1);
        Basket testBasket = basketList.get(basketList.size() - 1);
        assertThat(testBasket.getBasketId()).isEqualTo(DEFAULT_BASKET_ID);
        assertThat(testBasket.getBasketState()).isEqualTo(DEFAULT_BASKET_STATE);
    }

    @Test
    @Transactional
    void createBasketWithExistingId() throws Exception {
        // Create the Basket with an existing ID
        basket.setId(1L);

        int databaseSizeBeforeCreate = basketRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBasketMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(basket)))
            .andExpect(status().isBadRequest());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkBasketIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = basketRepository.findAll().size();
        // set the field null
        basket.setBasketId(null);

        // Create the Basket, which fails.

        restBasketMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(basket)))
            .andExpect(status().isBadRequest());

        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBasketStateIsRequired() throws Exception {
        int databaseSizeBeforeTest = basketRepository.findAll().size();
        // set the field null
        basket.setBasketState(null);

        // Create the Basket, which fails.

        restBasketMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(basket)))
            .andExpect(status().isBadRequest());

        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBaskets() throws Exception {
        // Initialize the database
        basketRepository.saveAndFlush(basket);

        // Get all the basketList
        restBasketMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(basket.getId().intValue())))
            .andExpect(jsonPath("$.[*].basketId").value(hasItem(DEFAULT_BASKET_ID.intValue())))
            .andExpect(jsonPath("$.[*].basketState").value(hasItem(DEFAULT_BASKET_STATE.toString())));
    }

    @Test
    @Transactional
    void getBasket() throws Exception {
        // Initialize the database
        basketRepository.saveAndFlush(basket);

        // Get the basket
        restBasketMockMvc
            .perform(get(ENTITY_API_URL_ID, basket.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(basket.getId().intValue()))
            .andExpect(jsonPath("$.basketId").value(DEFAULT_BASKET_ID.intValue()))
            .andExpect(jsonPath("$.basketState").value(DEFAULT_BASKET_STATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBasket() throws Exception {
        // Get the basket
        restBasketMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBasket() throws Exception {
        // Initialize the database
        basketRepository.saveAndFlush(basket);

        int databaseSizeBeforeUpdate = basketRepository.findAll().size();

        // Update the basket
        Basket updatedBasket = basketRepository.findById(basket.getId()).get();
        // Disconnect from session so that the updates on updatedBasket are not directly saved in db
        em.detach(updatedBasket);
        updatedBasket.basketId(UPDATED_BASKET_ID).basketState(UPDATED_BASKET_STATE);

        restBasketMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBasket.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBasket))
            )
            .andExpect(status().isOk());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
        Basket testBasket = basketList.get(basketList.size() - 1);
        assertThat(testBasket.getBasketId()).isEqualTo(UPDATED_BASKET_ID);
        assertThat(testBasket.getBasketState()).isEqualTo(UPDATED_BASKET_STATE);
    }

    @Test
    @Transactional
    void putNonExistingBasket() throws Exception {
        int databaseSizeBeforeUpdate = basketRepository.findAll().size();
        basket.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBasketMockMvc
            .perform(
                put(ENTITY_API_URL_ID, basket.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(basket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBasket() throws Exception {
        int databaseSizeBeforeUpdate = basketRepository.findAll().size();
        basket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBasketMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(basket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBasket() throws Exception {
        int databaseSizeBeforeUpdate = basketRepository.findAll().size();
        basket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBasketMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(basket)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBasketWithPatch() throws Exception {
        // Initialize the database
        basketRepository.saveAndFlush(basket);

        int databaseSizeBeforeUpdate = basketRepository.findAll().size();

        // Update the basket using partial update
        Basket partialUpdatedBasket = new Basket();
        partialUpdatedBasket.setId(basket.getId());

        partialUpdatedBasket.basketId(UPDATED_BASKET_ID);

        restBasketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBasket.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBasket))
            )
            .andExpect(status().isOk());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
        Basket testBasket = basketList.get(basketList.size() - 1);
        assertThat(testBasket.getBasketId()).isEqualTo(UPDATED_BASKET_ID);
        assertThat(testBasket.getBasketState()).isEqualTo(DEFAULT_BASKET_STATE);
    }

    @Test
    @Transactional
    void fullUpdateBasketWithPatch() throws Exception {
        // Initialize the database
        basketRepository.saveAndFlush(basket);

        int databaseSizeBeforeUpdate = basketRepository.findAll().size();

        // Update the basket using partial update
        Basket partialUpdatedBasket = new Basket();
        partialUpdatedBasket.setId(basket.getId());

        partialUpdatedBasket.basketId(UPDATED_BASKET_ID).basketState(UPDATED_BASKET_STATE);

        restBasketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBasket.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBasket))
            )
            .andExpect(status().isOk());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
        Basket testBasket = basketList.get(basketList.size() - 1);
        assertThat(testBasket.getBasketId()).isEqualTo(UPDATED_BASKET_ID);
        assertThat(testBasket.getBasketState()).isEqualTo(UPDATED_BASKET_STATE);
    }

    @Test
    @Transactional
    void patchNonExistingBasket() throws Exception {
        int databaseSizeBeforeUpdate = basketRepository.findAll().size();
        basket.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBasketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, basket.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(basket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBasket() throws Exception {
        int databaseSizeBeforeUpdate = basketRepository.findAll().size();
        basket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBasketMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(basket))
            )
            .andExpect(status().isBadRequest());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBasket() throws Exception {
        int databaseSizeBeforeUpdate = basketRepository.findAll().size();
        basket.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBasketMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(basket)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Basket in the database
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBasket() throws Exception {
        // Initialize the database
        basketRepository.saveAndFlush(basket);

        int databaseSizeBeforeDelete = basketRepository.findAll().size();

        // Delete the basket
        restBasketMockMvc
            .perform(delete(ENTITY_API_URL_ID, basket.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Basket> basketList = basketRepository.findAll();
        assertThat(basketList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
