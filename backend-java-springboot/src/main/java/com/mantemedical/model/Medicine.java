package com.mantemedical.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Medicine {
    private String id;
    private String name;
    private String genericName;
    private String category;
    private BigDecimal price;
    private BigDecimal mrp;
    private Integer stock;
    private String unit;
    private String manufacturer;
    private Boolean prescriptionRequired;
    private String batchNo;
    private LocalDate expiryDate;

    // Constructors
    public Medicine() {}

    public Medicine(String id, String name, String genericName, String category, BigDecimal price, BigDecimal mrp, Integer stock, String unit, String manufacturer, Boolean prescriptionRequired, String batchNo, LocalDate expiryDate) {
        this.id = id;
        this.name = name;
        this.genericName = genericName;
        this.category = category;
        this.price = price;
        this.mrp = mrp;
        this.stock = stock;
        this.unit = unit;
        this.manufacturer = manufacturer;
        this.prescriptionRequired = prescriptionRequired;
        this.batchNo = batchNo;
        this.expiryDate = expiryDate;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getMrp() { return mrp; }
    public void setMrp(BigDecimal mrp) { this.mrp = mrp; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
    public Boolean getPrescriptionRequired() { return prescriptionRequired; }
    public void setPrescriptionRequired(Boolean prescriptionRequired) { this.prescriptionRequired = prescriptionRequired; }
    public String getBatchNo() { return batchNo; }
    public void setBatchNo(String batchNo) { this.batchNo = batchNo; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
