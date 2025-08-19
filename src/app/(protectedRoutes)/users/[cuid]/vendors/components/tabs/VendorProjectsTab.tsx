import React from "react";
import { StatusBadge } from "@components/Badge";

import { VendorDetail } from "../../hooks/useGetVendor";

interface VendorProjectsTabProps {
  vendor: VendorDetail;
}

export const VendorProjectsTab: React.FC<VendorProjectsTabProps> = ({
  vendor,
}) => {
  const { projects } = vendor;

  return (
    <div className="vendor-projects">
      <div className="info-section">
        <h4>Project History</h4>
        <div className="projects-table">
          <div className="projects-table-header">
            <div className="header-cell">Project</div>
            <div className="header-cell">Property</div>
            <div className="header-cell">Date</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Amount</div>
          </div>
          {projects.map((project) => (
            <div key={project.id} className="project-row">
              <div className="project-cell">
                <div className="project-title">{project.title}</div>
              </div>
              <div className="project-cell">
                <div className="project-property">{project.property}</div>
              </div>
              <div className="project-cell">{project.date}</div>
              <div className="project-cell">
                <StatusBadge
                  status={project.status === 'completed' ? 'success' : 'pending'}
                  variant="dot"
                >
                  {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </StatusBadge>
              </div>
              <div className="project-cell project-amount">{project.amount}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>Project Summary</h4>
        <div className="info-grid">
          <div className="info-item">
            <i className="bx bx-task"></i>
            <div className="info-content">
              <div className="info-label">Total Projects</div>
              <div className="info-value">{projects.length}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-check-circle"></i>
            <div className="info-content">
              <div className="info-label">Completed</div>
              <div className="info-value">
                {projects.filter(p => p.status === 'completed').length}
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-time-five"></i>
            <div className="info-content">
              <div className="info-label">In Progress</div>
              <div className="info-value">
                {projects.filter(p => p.status === 'in-progress').length}
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-dollar"></i>
            <div className="info-content">
              <div className="info-label">Total Value</div>
              <div className="info-value">
                ${projects.reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, '')), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorProjectsTab.displayName = 'VendorProjectsTab';