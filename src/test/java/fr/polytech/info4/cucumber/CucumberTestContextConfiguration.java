package fr.polytech.info4.cucumber;

import fr.polytech.info4.CoopcycleApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = CoopcycleApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
