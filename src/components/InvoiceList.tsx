import { useState } from "react";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";

interface InvoiceListProps {
  onEditInvoice: (invoice: Invoice) => void;
}

export const InvoiceList = ({ onEditInvoice }: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data - in real app this would come from API/state
  const invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      clientId: '1',
      client: { id: '1', name: 'Acme Corp', email: 'contact@acme.com' },
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [],
      subtotal: 1500,
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
      tax: 250,
      total: 2750,
      status: 'overdue',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      clientId: '3',
      client: { id: '3', name: 'Design Studio', email: 'hello@designstudio.com' },
      issueDate: '2024-01-25',
      dueDate: '2024-02-25',
      items: [],
      subtotal: 3200,
      tax: 320,
      total: 3520,
      status: 'sent',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-25',
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

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="p-4 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{invoice.invoiceNumber}</span>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              <span className="font-bold text-lg">${invoice.total.toLocaleString()}</span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium">{invoice.client.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Issue Date:</span>
                <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onEditInvoice(invoice)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};