'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

// Schema
const formSchema = z.object({
  category: z.enum(['auto', 'spirits', 'wine', 'beer']),
  brandName: z.string().min(1, 'Brand name is required'),
  productClass: z.string().min(1, 'Product class/type is required'),
  alcoholContent: z.string().regex(/^\d+(\.\d+)?$/, 'Must be a number like 45'),
  netContents: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'auto',
      brandName: '',
      productClass: '',
      alcoholContent: '',
      netContents: '',
    },
  });

  const category = watch('category');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please upload an image');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('image', fileInputRef.current.files[0]);
    formData.append('brandName', data.brandName);
    formData.append('productClass', data.productClass);
    formData.append('alcoholContent', data.alcoholContent);
    if (data.netContents) formData.append('netContents', data.netContents);

    try {
      const res = await fetch('/api/proxy/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Server error');
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setError('Cannot reach OCR server. Is `uvicorn ocr:app --reload` running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Sparkles className="w-20 h-20 text-amber-600" />
          </div>
          <h1 className="text-6xl font-bold text-amber-900 mb-6">
            TTB Alcohol Label Verifier
          </h1>
          <p className="text-2xl text-amber-800 font-medium max-w-4xl mx-auto">
            AI-Powered • Multi-Category • Full Regulatory Compliance Audit
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white p-12 text-center">
            <h2 className="text-4xl font-bold flex items-center justify-center gap-5">
              <FileText className="w-14 h-14" />
              Upload & Verify Label
            </h2>
            <p className="mt-4 text-xl text-amber-100">
              Supports Distilled Spirits • Wine • Beer
            </p>
          </div>

          <div className="p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Beverage Category - ACCESSIBLE */}
              <div>
                <label
                  htmlFor="beverage-category"
                  className="text-xl font-semibold text-gray-800 flex items-center gap-3"
                >
                  <AlertCircle className="w-7 h-7 text-amber-600" />
                  Beverage Category
                </label>
                <select
                  id="beverage-category"
                  {...register('category')}
                  className="mt-4 w-full px-8 py-5 text-xl rounded-2xl border-2 border-amber-300 focus:border-amber-600 focus:ring-amber-600 bg-white shadow-md"
                >
                  <option value="auto">Auto-Detect</option>
                  <option value="spirits">Distilled Spirits</option>
                  <option value="wine">Wine</option>
                  <option value="beer">Beer / Malt Beverage</option>
                </select>
              </div>

              {/* Form Grid */}
              <div className="grid md:grid-cols-2 gap-12">
                {/* Brand Name */}
                <div>
                  <label htmlFor="brand-name" className="block text-xl font-semibold text-gray-800">
                    Brand Name
                  </label>
                  <input
                    id="brand-name"
                    {...register('brandName')}
                    placeholder="Old Tom Distillery"
                    className="mt-3 w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-amber-600 text-lg"
                  />
                  {errors.brandName && <p className="text-red-600 text-sm mt-2">{errors.brandName.message}</p>}
                </div>

                {/* Product Class */}
                <div>
                  <label htmlFor="product-class" className="block text-xl font-semibold text-gray-800">
                    {category === 'wine' ? 'Varietal' : category === 'beer' ? 'Style' : 'Class & Type'}
                  </label>
                  <input
                    id="product-class"
                    {...register('productClass')}
                    placeholder={category === 'wine' ? 'Orange Muscat' : category === 'beer' ? 'Hazy IPA' : 'Kentucky Straight Bourbon Whiskey'}
                    className="mt-3 w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-amber-600 text-lg"
                  />
                  {errors.productClass && <p className="text-red-600 text-sm mt-2">{errors.productClass.message}</p>}
                </div>

                {/* Alcohol Content */}
                <div>
                  <label htmlFor="alcohol-content" className="block text-xl font-semibold text-gray-800">
                    Alcohol Content (%)
                  </label>
                  <input
                    id="alcohol-content"
                    {...register('alcoholContent')}
                    placeholder="45"
                    className="mt-3 w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-amber-600 text-lg"
                  />
                  {errors.alcoholContent && <p className="text-red-600 text-sm mt-2">{errors.alcoholContent.message}</p>}
                </div>

                {/* Net Contents */}
                <div>
                  <label htmlFor="net-contents" className="block text-xl font-semibold text-gray-800">
                    Net Contents (optional)
                  </label>
                  <input
                    id="net-contents"
                    {...register('netContents')}
                    placeholder="750 mL • 12 fl. oz."
                    className="mt-3 w-full px-8 py-6 rounded-2xl border-2 border-gray-300 focus:border-amber-600 text-lg"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="label-image" className="block text-xl font-semibold text-gray-800 mb-6">
                  Label Image
                </label>
                <div
                  className="border-4 border-dashed border-amber-400 rounded-3xl p-24 text-center hover:border-amber-600 cursor-pointer transition-all bg-amber-50/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-28 w-28 text-amber-700 mb-amber-700 mb-8" />
                  <p className="text-2xl font-medium text-gray-700">Drop image here or click to upload</p>
                  <p className="text-gray-500 mt-3">JPG, PNG • Max 100MB</p>
                  <input
                    ref={fileInputRef}
                    id="label-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Preview */}
              {preview && (
                <div className="text-center -mt-12 mb-12">
                  <img
                    src={preview}
                    alt="Label preview"
                    className="max-w-4xl mx-auto rounded-3xl shadow-2xl border-8 border-amber-300"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-8 text-3xl font-bold text-white bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 rounded-3xl shadow-2xl disabled:opacity-70 flex items-center justify-center gap-6 transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-14 w-14 animate-spin" />
                    <span>Analyzing Label...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-14 w-14" />
                    <span>Verify Label + Full TTB Audit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RESULTS */}
        {error && (
          <div className="mt-20 p-12 bg-red-50 border-4 border-red-400 rounded-3xl text-center">
            <XCircle className="mx-auto h-24 w-24 text-red-600 mb-8" />
            <p className="text-3xl font-bold text-red-800">{error}</p>
          </div>
        )}

        {result && !error && (
          <div className="mt-20 space-y-16">
            <div className={`p-16 rounded-3xl text-center text-white font-bold text-6xl shadow-2xl ${
              result.isMatch ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-rose-600'
            }`}>
              {result.isMatch ? 'LABEL MATCHES APPLICATION' : 'LABEL DOES NOT MATCH'}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {result.details.map((d: { field: string; status: string; message: string }) => (
                <div
                  key={d.field}
                  className={`p-12 rounded-3xl border-8 shadow-2xl ${
                    d.status === 'match'
                      ? 'bg-emerald-50 border-emerald-600'
                      : 'bg-rose-50 border-rose-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-gray-800">{d.field}</h3>
                    {d.status === 'match' ? (
                      <CheckCircle className="h-24 w-24 text-emerald-600" />
                    ) : (
                      <XCircle className="h-24 w-24 text-rose-600" />
                    )}
                  </div>
                  <p className="mt-8 text-2xl font-medium text-center">{d.message}</p>
                </div>
              ))}
            </div>

            {result.complianceReport && (
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-3xl shadow-2xl">
                <div className="p-16 text-center">
                  <h2 className="text-5xl font-bold mb-6">TTB Full Compliance Report</h2>
                  <p className="text-2xl">Category: {result.detectedCategory?.toUpperCase() || 'UNKNOWN'}</p>
                </div>
                <div className="p-12 space-y-10">
                  {result.complianceReport.map((item: any) => (
                    <div
                      key={item.item}
                      className={`p-10 rounded-2xl border-l-8 ${
                        item.compliant
                          ? 'bg-green-800/40 border-green-400'
                          : 'bg-red-800/40 border-red-400'
                      }`}
                    >
                      <div className="flex gap-8 items-start">
                        {item.compliant ? (
                          <CheckCircle className="h-14 w-14 text-green-300" />
                        ) : (
                          <XCircle className="h-14 w-14 text-red-300" />
                        )}
                        <div>
                          <h4 className="text-3xl font-bold">{item.item}</h4>
                          <p className="mt-4 text-xl opacity-90">{item.description}</p>
                          {!item.compliant && (
                            <p className="mt-6 text-red-300 text-2xl font-bold">
                              Non-Compliant: {item.issue}
                            </p>
                          )}
                          <p className="text-lg italic mt-5 opacity-75">{item.citation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
