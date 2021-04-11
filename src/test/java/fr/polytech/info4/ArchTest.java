package fr.polytech.info4;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("fr.polytech.info4");

        noClasses()
            .that()
            .resideInAnyPackage("fr.polytech.info4.service..")
            .or()
            .resideInAnyPackage("fr.polytech.info4.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..fr.polytech.info4.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
