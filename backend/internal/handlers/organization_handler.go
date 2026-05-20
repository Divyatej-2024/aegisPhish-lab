package handlers

import (
    "net/http"

    "github.com/aegisPhish/backend/internal/services"
    "github.com/aegisPhish/backend/pkg/utils"
    "github.com/gin-gonic/gin"
)

type OrganizationHandler struct {
    orgService *services.OrganizationService
}

func NewOrganizationHandler(orgService *services.OrganizationService) *OrganizationHandler {
    return &OrganizationHandler{orgService: orgService}
}

func (h *OrganizationHandler) CreateOrganization(c *gin.Context) {
    var req services.CreateOrganizationRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
        return
    }

    org, err := h.orgService.CreateOrganization(&req)
    if err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Failed to create organization", err.Error(), nil)
        return
    }

    utils.RespondSuccess(c, http.StatusCreated, "Organization created successfully", org)
}

func (h *OrganizationHandler) GetOrganization(c *gin.Context) {
    orgID := c.Param("id")
    org, err := h.orgService.GetOrganization(orgID)
    if err != nil {
        utils.RespondError(c, http.StatusNotFound, "Organization not found", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "Organization retrieved successfully", org)
}

func (h *OrganizationHandler) ListOrganizations(c *gin.Context) {
    orgs, err := h.orgService.ListOrganizations()
    if err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Unable to list organizations", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "Organizations retrieved successfully", orgs)
}

func (h *OrganizationHandler) CreateDepartment(c *gin.Context) {
    orgID := c.Param("id")
    var req services.CreateDepartmentRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        utils.RespondError(c, http.StatusBadRequest, "Invalid request", err.Error(), nil)
        return
    }

    department, err := h.orgService.CreateDepartment(orgID, &req)
    if err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Failed to create department", err.Error(), nil)
        return
    }

    utils.RespondSuccess(c, http.StatusCreated, "Department created successfully", department)
}

func (h *OrganizationHandler) ListDepartments(c *gin.Context) {
    orgID := c.Param("id")
    departments, err := h.orgService.ListDepartments(orgID)
    if err != nil {
        utils.RespondError(c, http.StatusInternalServerError, "Unable to list departments", err.Error(), nil)
        return
    }
    utils.RespondSuccess(c, http.StatusOK, "Departments retrieved successfully", departments)
}
