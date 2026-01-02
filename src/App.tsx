import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CustomerInputForm() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    projectName: '',
    description: '',
    dueDate: '',
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Request a Quote</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
              />
              <Input
                name="contactName"
                placeholder="Contact Name"
                value={form.contactName}
                onChange={handleChange}
              />
              <Input
                name="email"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <Input
              name="projectName"
              placeholder="Project Name"
              value={form.projectName}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Project Description, Specs, Tolerances, etc."
              rows={6}
              value={form.description}
              onChange={handleChange}
            />
            <Input
              name="dueDate"
              placeholder="Desired Due Date"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
            <div>
              <label className="block mb-2 text-sm">Upload Drawing or File</label>
              <Input
                type="file"
                accept=".pdf,.step,.stp,.igs,.iges,.dxf,.zip"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center">
              <Button type="submit" className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700">
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
