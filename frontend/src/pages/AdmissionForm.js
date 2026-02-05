import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BookOpen, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const AdmissionForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    program: '',
    previousEducation: {
      institution: '',
      percentage: '',
      year: ''
    },
    entranceScore: ''
  });

  const programs = [
    'Computer Science B.Tech',
    'Electrical Engineering B.Tech',
    'Civil Engineering B.Tech',
    'Commerce B.Com',
    'Economics B.A',
    'English Literature B.A'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/admissions`, {
        ...formData,
        previousEducation: {
          institution: formData.previousEducation.institution,
          percentage: parseFloat(formData.previousEducation.percentage),
          year: parseInt(formData.previousEducation.year)
        },
        entranceScore: parseFloat(formData.entranceScore)
      });
      
      setApplicationData(response.data);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-2xl border border-stone-200 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-900 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-900 mb-4" data-testid="success-title">Application Submitted!</h2>
          <p className="text-stone-600 mb-6">Your application has been received successfully.</p>
          
          <div className="bg-stone-50 p-6 rounded-lg mb-6 text-left">
            <p className="text-sm text-stone-600 mb-2">Application Details:</p>
            <p className="font-medium text-stone-900">Name: {applicationData?.applicantName}</p>
            <p className="text-stone-700">Program: {applicationData?.program}</p>
            <p className="text-stone-700">Merit Rank: #{applicationData?.meritRank}</p>
            <p className="text-sm text-stone-500 mt-2">Status: Pending Review</p>
          </div>

          <Link to="/">
            <Button className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-full" data-testid="back-home-button">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="w-12 h-12 text-emerald-900" />
          </Link>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2" data-testid="admission-form-title">Admission Application</h1>
          <p className="text-stone-600">Complete the form to apply for admission</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="applicantName">Full Name *</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  required
                  className="mt-2"
                  data-testid="applicant-name-input"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="mt-2"
                  data-testid="email-input"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="mt-2"
                  data-testid="phone-input"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  required
                  className="mt-2"
                  data-testid="dob-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
                className="mt-2"
                data-testid="address-input"
              />
            </div>

            <div>
              <Label htmlFor="program">Program *</Label>
              <Select onValueChange={(value) => setFormData({...formData, program: value})} required>
                <SelectTrigger className="mt-2" data-testid="program-select">
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(prog => (
                    <SelectItem key={prog} value={prog}>{prog}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <h3 className="font-semibold text-stone-900 mb-4">Previous Education</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    value={formData.previousEducation.institution}
                    onChange={(e) => setFormData({...formData, previousEducation: {...formData.previousEducation, institution: e.target.value}})}
                    required
                    className="mt-2"
                    data-testid="institution-input"
                  />
                </div>
                <div>
                  <Label htmlFor="percentage">Percentage *</Label>
                  <Input
                    id="percentage"
                    type="number"
                    step="0.01"
                    value={formData.previousEducation.percentage}
                    onChange={(e) => setFormData({...formData, previousEducation: {...formData.previousEducation, percentage: e.target.value}})}
                    required
                    className="mt-2"
                    data-testid="percentage-input"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.previousEducation.year}
                    onChange={(e) => setFormData({...formData, previousEducation: {...formData.previousEducation, year: e.target.value}})}
                    required
                    className="mt-2"
                    data-testid="year-input"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="entranceScore">Entrance Exam Score *</Label>
              <Input
                id="entranceScore"
                type="number"
                step="0.01"
                value={formData.entranceScore}
                onChange={(e) => setFormData({...formData, entranceScore: e.target.value})}
                required
                className="mt-2"
                placeholder="Out of 100"
                data-testid="entrance-score-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 rounded-full"
              data-testid="submit-application-button"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};