package com.mantemedical.controller;

import com.mantemedical.model.Medicine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MedicineController {

    private final List<Medicine> inventory = new ArrayList<>();

    public MedicineController() {
        inventory.add(new Medicine("med-1", "Paracetamol 650mg (Dolo 650)", "Paracetamol", "Pain & Fever", new BigDecimal("30.50"), new BigDecimal("34.00"), 120, "15 Tablets / Strip", "Micro Labs", false, "DL-8921", LocalDate.of(2026, 11, 30)));
        inventory.add(new Medicine("med-2", "Azithromycin 500mg (Azee 500)", "Azithromycin", "Antibiotics", new BigDecimal("115.00"), new BigDecimal("132.50"), 45, "5 Tablets / Strip", "Cipla Ltd", true, "AZ-4091", LocalDate.of(2026, 8, 15)));
    }

    @GetMapping("/store-info")
    public Map<String, String> getStoreInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("storeName", "Mante Medical & Healthcare");
        info.put("owner", "MR. Rushikesh Suresh Mante");
        info.put("contact", "8237729148");
        info.put("address", "Sawkhed Tejan, Tq. Sindkhed Raja, Dist. Buldhana");
        return info;
    }

    @GetMapping("/medicines")
    public List<Medicine> getAllMedicines(@RequestParam(required = false) String category) {
        if (category != null && !category.equalsIgnoreCase("All")) {
            return inventory.stream().filter(m -> m.getCategory().equalsIgnoreCase(category)).toList();
        }
        return inventory;
    }

    @PostMapping("/medicines")
    public ResponseEntity<Medicine> addMedicine(@RequestBody Medicine medicine) {
        medicine.setId("med-" + System.currentTimeMillis());
        inventory.add(medicine);
        return ResponseEntity.ok(medicine);
    }
}
