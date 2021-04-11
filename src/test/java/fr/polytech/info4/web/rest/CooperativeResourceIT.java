package fr.polytech.info4.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.polytech.info4.IntegrationTest;
import fr.polytech.info4.domain.Cooperative;
import fr.polytech.info4.repository.CooperativeRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CooperativeResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CooperativeResourceIT {

    private static final Long DEFAULT_COOPERATIVE_ID = 1L;
    private static final Long UPDATED_COOPERATIVE_ID = 2L;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_AREA = "AAAAAAAAAA";
    private static final String UPDATED_AREA = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/cooperatives";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CooperativeRepository cooperativeRepository;

    @Mock
    private CooperativeRepository cooperativeRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCooperativeMockMvc;

    private Cooperative cooperative;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cooperative createEntity(EntityManager em) {
        Cooperative cooperative = new Cooperative().cooperativeId(DEFAULT_COOPERATIVE_ID).name(DEFAULT_NAME).area(DEFAULT_AREA);
        return cooperative;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cooperative createUpdatedEntity(EntityManager em) {
        Cooperative cooperative = new Cooperative().cooperativeId(UPDATED_COOPERATIVE_ID).name(UPDATED_NAME).area(UPDATED_AREA);
        return cooperative;
    }

    @BeforeEach
    public void initTest() {
        cooperative = createEntity(em);
    }

    @Test
    @Transactional
    void createCooperative() throws Exception {
        int databaseSizeBeforeCreate = cooperativeRepository.findAll().size();
        // Create the Cooperative
        restCooperativeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cooperative)))
            .andExpect(status().isCreated());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeCreate + 1);
        Cooperative testCooperative = cooperativeList.get(cooperativeList.size() - 1);
        assertThat(testCooperative.getCooperativeId()).isEqualTo(DEFAULT_COOPERATIVE_ID);
        assertThat(testCooperative.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCooperative.getArea()).isEqualTo(DEFAULT_AREA);
    }

    @Test
    @Transactional
    void createCooperativeWithExistingId() throws Exception {
        // Create the Cooperative with an existing ID
        cooperative.setId(1L);

        int databaseSizeBeforeCreate = cooperativeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCooperativeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cooperative)))
            .andExpect(status().isBadRequest());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCooperativeIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = cooperativeRepository.findAll().size();
        // set the field null
        cooperative.setCooperativeId(null);

        // Create the Cooperative, which fails.

        restCooperativeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cooperative)))
            .andExpect(status().isBadRequest());

        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCooperatives() throws Exception {
        // Initialize the database
        cooperativeRepository.saveAndFlush(cooperative);

        // Get all the cooperativeList
        restCooperativeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cooperative.getId().intValue())))
            .andExpect(jsonPath("$.[*].cooperativeId").value(hasItem(DEFAULT_COOPERATIVE_ID.intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].area").value(hasItem(DEFAULT_AREA)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCooperativesWithEagerRelationshipsIsEnabled() throws Exception {
        when(cooperativeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCooperativeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(cooperativeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCooperativesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(cooperativeRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCooperativeMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(cooperativeRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getCooperative() throws Exception {
        // Initialize the database
        cooperativeRepository.saveAndFlush(cooperative);

        // Get the cooperative
        restCooperativeMockMvc
            .perform(get(ENTITY_API_URL_ID, cooperative.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cooperative.getId().intValue()))
            .andExpect(jsonPath("$.cooperativeId").value(DEFAULT_COOPERATIVE_ID.intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.area").value(DEFAULT_AREA));
    }

    @Test
    @Transactional
    void getNonExistingCooperative() throws Exception {
        // Get the cooperative
        restCooperativeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCooperative() throws Exception {
        // Initialize the database
        cooperativeRepository.saveAndFlush(cooperative);

        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();

        // Update the cooperative
        Cooperative updatedCooperative = cooperativeRepository.findById(cooperative.getId()).get();
        // Disconnect from session so that the updates on updatedCooperative are not directly saved in db
        em.detach(updatedCooperative);
        updatedCooperative.cooperativeId(UPDATED_COOPERATIVE_ID).name(UPDATED_NAME).area(UPDATED_AREA);

        restCooperativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCooperative.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCooperative))
            )
            .andExpect(status().isOk());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
        Cooperative testCooperative = cooperativeList.get(cooperativeList.size() - 1);
        assertThat(testCooperative.getCooperativeId()).isEqualTo(UPDATED_COOPERATIVE_ID);
        assertThat(testCooperative.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCooperative.getArea()).isEqualTo(UPDATED_AREA);
    }

    @Test
    @Transactional
    void putNonExistingCooperative() throws Exception {
        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();
        cooperative.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCooperativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, cooperative.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cooperative))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCooperative() throws Exception {
        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();
        cooperative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCooperativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(cooperative))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCooperative() throws Exception {
        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();
        cooperative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCooperativeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(cooperative)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCooperativeWithPatch() throws Exception {
        // Initialize the database
        cooperativeRepository.saveAndFlush(cooperative);

        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();

        // Update the cooperative using partial update
        Cooperative partialUpdatedCooperative = new Cooperative();
        partialUpdatedCooperative.setId(cooperative.getId());

        partialUpdatedCooperative.area(UPDATED_AREA);

        restCooperativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCooperative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCooperative))
            )
            .andExpect(status().isOk());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
        Cooperative testCooperative = cooperativeList.get(cooperativeList.size() - 1);
        assertThat(testCooperative.getCooperativeId()).isEqualTo(DEFAULT_COOPERATIVE_ID);
        assertThat(testCooperative.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCooperative.getArea()).isEqualTo(UPDATED_AREA);
    }

    @Test
    @Transactional
    void fullUpdateCooperativeWithPatch() throws Exception {
        // Initialize the database
        cooperativeRepository.saveAndFlush(cooperative);

        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();

        // Update the cooperative using partial update
        Cooperative partialUpdatedCooperative = new Cooperative();
        partialUpdatedCooperative.setId(cooperative.getId());

        partialUpdatedCooperative.cooperativeId(UPDATED_COOPERATIVE_ID).name(UPDATED_NAME).area(UPDATED_AREA);

        restCooperativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCooperative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCooperative))
            )
            .andExpect(status().isOk());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
        Cooperative testCooperative = cooperativeList.get(cooperativeList.size() - 1);
        assertThat(testCooperative.getCooperativeId()).isEqualTo(UPDATED_COOPERATIVE_ID);
        assertThat(testCooperative.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCooperative.getArea()).isEqualTo(UPDATED_AREA);
    }

    @Test
    @Transactional
    void patchNonExistingCooperative() throws Exception {
        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();
        cooperative.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCooperativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cooperative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cooperative))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCooperative() throws Exception {
        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();
        cooperative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCooperativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(cooperative))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCooperative() throws Exception {
        int databaseSizeBeforeUpdate = cooperativeRepository.findAll().size();
        cooperative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCooperativeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(cooperative))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cooperative in the database
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCooperative() throws Exception {
        // Initialize the database
        cooperativeRepository.saveAndFlush(cooperative);

        int databaseSizeBeforeDelete = cooperativeRepository.findAll().size();

        // Delete the cooperative
        restCooperativeMockMvc
            .perform(delete(ENTITY_API_URL_ID, cooperative.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Cooperative> cooperativeList = cooperativeRepository.findAll();
        assertThat(cooperativeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
