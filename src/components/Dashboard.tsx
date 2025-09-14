import { DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatCard } from "./StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";

interface DashboardProps {
  onCreateInvoice: () => void;
}

export const Dashboard = ({ onCreateInvoice }: DashboardProps) => {
  // Mock data - in real app this would come from API/state
  const stats = {
    totalRevenue: 12450,
    totalInvoices: 28,
    paidInvoices: 24,
    overdueInvoices: 2,
  };

  const recentInvoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      clientId: '1',
      client: { id: '1', name: 'Acme Corp', email: 'contact@acme.com' },
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [],
      subtotal: 1500,
      discount: 0,
      tax: 150,
      total: 1650,
      status: 'paid',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-16',
    },
    {
      id: '2', 
      invoiceNumber: 'INV-002',
      clientId: '2',
      client: { id: '2', name: 'Tech Solutions', email: 'info@techsolutions.com' },
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      items: [],
      subtotal: 2500,
      discount: 0,
      tax: 250,
      total: 2750,
      status: 'overdue',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-success text-success-foreground',
      sent: 'bg-info text-info-foreground', 
      draft: 'bg-secondary text-secondary-foreground',
      overdue: 'bg-destructive text-destructive-foreground',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          variant="default"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          icon={FileText}
          variant="info"
        />
        <StatCard
          title="Paid"
          value={stats.paidInvoices}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueInvoices}
          icon={AlertCircle}
          variant="warning"
        />
      </div>

      <Card className="p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Invoices</h3>
          <Button onClick={onCreateInvoice} className="bg-primary hover:bg-primary/90">
            Create Invoice
          </Button>
        </div>
        <div className="space-y-3">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{invoice.invoiceNumber}</span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                <p className="text-xs text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${invoice.total.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};