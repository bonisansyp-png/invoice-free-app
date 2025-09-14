import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Invoice, InvoiceItem, Client } from "@/types/invoice";

interface CreateInvoiceProps {
  onBack: () => void;
  editingInvoice?: Invoice | null;
}

export const CreateInvoice = ({ onBack, editingInvoice }: CreateInvoiceProps) => {
  const { toast } = useToast();
  
  // Mock clients data
  const clients: Client[] = [
    { id: '1', name: 'Acme Corp', email: 'contact@acme.com', company: 'Acme Corporation' },
    { id: '2', name: 'Tech Solutions', email: 'info@techsolutions.com', company: 'Tech Solutions Inc' },
    { id: '3', name: 'Design Studio', email: 'hello@designstudio.com', company: 'Creative Design Studio' },
  ];

  const [selectedClient, setSelectedClient] = useState(editingInvoice?.clientId || '');
  const [invoiceNumber, setInvoiceNumber] = useState(editingInvoice?.invoiceNumber || `INV-${String(Date.now()).slice(-3)}`);
  const [issueDate, setIssueDate] = useState(editingInvoice?.issueDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(editingInvoice?.dueDate || '');
  const [notes, setNotes] = useState(editingInvoice?.notes || '');
  const [discount, setDiscount] = useState(editingInvoice?.discount || 0);
  const [items, setItems] = useState<InvoiceItem[]>(editingInvoice?.items || [
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const tax = afterDiscount * 0.1; // 10% tax
  const total = afterDiscount + tax;

  const handleSave = () => {
    if (!selectedClient || !dueDate || items.some(item => !item.description)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: editingInvoice ? "Invoice Updated" : "Invoice Created",
      description: `Invoice ${invoiceNumber} has been ${editingInvoice ? 'updated' : 'created'} successfully`,
    });

    onBack();
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
        </h1>
      </div>

      <Card className="p-4 shadow-card">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issue-date">Issue Date</Label>
              <Input
                id="issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="p-3 border border-border rounded-lg">
              <div className="space-y-3">
                <div>
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Rate ($)</Label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex-1">
                      <Label>Amount</Label>
                      <div className="mt-1 p-2 bg-muted rounded-md text-right font-semibold">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    {items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount ({discount}%):</span>
                <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (10%):</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 border border-border rounded-lg">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter discount percentage (0-100%)
          </p>
        </div>
      </Card>

      <Card className="p-4 shadow-card">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes or terms..."
          className="mt-1"
          rows={3}
        />
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          {editingInvoice ? 'Update' : 'Save'} Invoice
        </Button>
      </div>
    </div>
  );
};