
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Loader2, Save, ArrowLeft, MapPin, PlusCircle, Image, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Hostel, HostelAddress, parseHostelAddress } from "@/types/database";

// Make sure Address interface matches the HostelAddress interface in database.ts
interface Address extends HostelAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const ManageHostel = () => {
  const navigate = useNavigate();
  const { hostelId } = useParams<{ hostelId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    name: string;
    type: 'boys' | 'girls' | 'coed';
    description: string;
    address: Address;
    status: 'draft' | 'pending' | 'verified' | 'blocked';
  }>({
    name: '',
    type: 'boys',
    description: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
    status: 'draft'
  });

  useEffect(() => {
    if (hostelId) {
      fetchHostelData();
    }
  }, [hostelId]);

  const fetchHostelData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', hostelId)
        .single();

      if (error) throw error;

      if (data) {
        // Parse the address
        const parsedAddress = parseHostelAddress(data.address);
        
        setFormData({
          name: data.name || '',
          type: (data.type as 'boys' | 'girls' | 'coed') || 'boys',
          description: data.description || '',
          address: {
            line1: parsedAddress.line1 || '',
            line2: parsedAddress.line2 || '',
            city: parsedAddress.city || '',
            state: parsedAddress.state || '',
            pincode: parsedAddress.pincode || '',
          },
          status: (data.status as 'draft' | 'pending' | 'verified' | 'blocked') || 'draft'
        });

        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching hostel:', error);
      toast.error('Failed to load hostel data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleTypeChange = (value: 'boys' | 'girls' | 'coed') => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleStatusChange = (value: 'draft' | 'pending' | 'verified' | 'blocked') => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;

    setUploading(true);
    try {
      const fileExt = newImage.name.split('.').pop();
      const filePath = `hostels/${hostelId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('hostel-images')
        .upload(filePath, newImage);

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('hostel-images')
        .getPublicUrl(filePath);

      // Update hostel images array
      const updatedImages = [...images, publicUrlData.publicUrl];
      setImages(updatedImages);

      // Update in Supabase
      const { error: updateError } = await supabase
        .from('hostels')
        .update({ images: updatedImages })
        .eq('id', hostelId);

      if (updateError) throw updateError;

      toast.success('Image uploaded successfully');
      setNewImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);

      const { error } = await supabase
        .from('hostels')
        .update({ images: updatedImages })
        .eq('id', hostelId);

      if (error) throw error;

      setImages(updatedImages);
      toast.success('Image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Convert the Address to a format compatible with Json type
      const addressData: HostelAddress = {
        line1: formData.address.line1,
        line2: formData.address.line2,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode,
      };
      
      const { error } = await supabase
        .from('hostels')
        .update({
          name: formData.name,
          type: formData.type,
          description: formData.description,
          address: addressData,
          status: formData.status,
        })
        .eq('id', hostelId);

      if (error) throw error;
      
      toast.success('Hostel updated successfully');
      setTimeout(() => navigate('/owner/dashboard'), 500);
    } catch (error) {
      console.error('Error updating hostel:', error);
      toast.error('Failed to update hostel');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading hostel data...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Manage Hostel</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Hostel Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter hostel name"
                  required
                />
              </div>

              <div>
                <Label>Hostel Type</Label>
                <RadioGroup 
                  value={formData.type} 
                  onValueChange={(value) => handleTypeChange(value as 'boys' | 'girls' | 'coed')}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boys" id="boys" />
                    <Label htmlFor="boys" className="cursor-pointer">Boys</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="girls" id="girls" />
                    <Label htmlFor="girls" className="cursor-pointer">Girls</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coed" id="coed" />
                    <Label htmlFor="coed" className="cursor-pointer">Co-ed</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your hostel"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleStatusChange(value as 'draft' | 'pending' | 'verified' | 'blocked')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Verification</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Address Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="line1">Address Line 1</Label>
                <Input 
                  id="line1"
                  name="line1"
                  value={formData.address.line1}
                  onChange={handleAddressChange}
                  placeholder="Street address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="line2">Address Line 2</Label>
                <Input 
                  id="line2"
                  name="line2"
                  value={formData.address.line2}
                  onChange={handleAddressChange}
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">PIN Code</Label>
                <Input 
                  id="pincode"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleAddressChange}
                  placeholder="PIN code"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Hostel Images
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Hostel image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <Label>Add New Image</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                </div>
                {imagePreview && (
                  <div className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Image preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {newImage && (
                <Button 
                  type="button" 
                  onClick={handleImageUpload} 
                  disabled={uploading}
                  className="flex items-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            onClick={() => navigate('/owner/dashboard')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSaving}
            className="flex items-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageHostel;
