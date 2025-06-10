import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { unitService } from '../../services/unit.service';
import tenantService from '../../services/tenant.service';
import floorService from '../../services/floor.service';
import type { Unit, UnitStatus } from '../../types/unit';
import type { Tenant } from '../../types/tenant';
import type { Floor } from '../../types/floor';

const BasicReports: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    Promise.all([
      unitService.findAll(),
      tenantService.getAll(),
      floorService.getAll()
    ]).then(([units, tenants, floors]) => {
      setUnits(units);
      setTenants(tenants);
      setFloors(floors);
    });
  }, []);

  const calculateOccupancyRate = () => {
    if (units.length === 0) return 0;
    const occupiedUnits = units.filter(unit => unit.status === 'OCCUPIED').length;
    return ((occupiedUnits / units.length) * 100).toFixed(1);
  };

  const getStatusDistribution = () => {
    const statusCounts = units.reduce((acc, unit) => {
      acc[unit.status] = (acc[unit.status] || 0) + 1;
      return acc;
    }, {} as Record<UnitStatus, number>);

    return statusCounts;
  };

  const getFloorOccupancy = () => {
    return floors.map(floor => {
      const floorUnits = units.filter(unit => unit.floorId === floor.id);
      const occupiedUnits = floorUnits.filter(unit => unit.status === 'OCCUPIED').length;
      return {
        floor: floor.number,
        total: floorUnits.length,
        occupied: occupiedUnits,
        rate: floorUnits.length ? ((occupiedUnits / floorUnits.length) * 100).toFixed(1) : '0'
      };
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Basic Reports</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Overall Occupancy Rate"
              value={calculateOccupancyRate()}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Units"
              value={units.length}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Tenants"
              value={tenants.length}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Unit Status Distribution" loading={loading}>
            <div className="space-y-2">
              {Object.entries(getStatusDistribution()).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span className="capitalize">{status.toLowerCase()}</span>
                  <span>{count} units</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Floor-wise Occupancy" loading={loading}>
            <div className="space-y-2">
              {getFloorOccupancy().map(({ floor, total, occupied, rate }) => (
                <div key={floor} className="flex justify-between">
                  <span>Floor {floor}</span>
                  <span>{occupied}/{total} units ({rate}%)</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BasicReports; 