import React, { useState } from 'react';
import { FieldSelector } from './components/FieldSelector';
import { FileUpload } from './components/FileUpload';
import { ResultsDashboard } from './components/ResultsDashboard';
import { analyzePortfolio } from './services/geminiService';
import { AnalysisResult, FieldOfStudy } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [field, setField] = useState<FieldOfStudy | null>(null);
  const [csvContent, setCsvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFieldSelect = (selected: FieldOfStudy) => {
    setField(selected);
    setStep(2);
  };

  const handleFileLoaded = (content: string, name: string) => {
    setCsvContent(content);
    setFileName(name);
  };

  const handleAnalysis = async () => {
    if (!field || !csvContent) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysisResult = await analyzePortfolio(field, csvContent);
      setResult(analysisResult);
      setStep(3);
    } catch (err) {
      setError("Failed to analyze portfolio. Please check your API key or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setField(null);
    setCsvContent("");
    setFileName("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <h1 className="text-xl font-bold text-gray-900">Skill Match</h1>
          </div>
          <div className="text-sm text-gray-500">Internship Matcher v1.0</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Progress Steps */}
        {step < 3 && (
           <div className="mb-10 flex justify-center">
             <div className="flex items-center space-x-4">
               <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>1</div>
               <span className={`${step >= 1 ? 'text-indigo-900 font-medium' : 'text-gray-400'}`}>Select Field</span>
               <div className="w-10 h-0.5 bg-gray-300"></div>
               <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>2</div>
               <span className={`${step >= 2 ? 'text-indigo-900 font-medium' : 'text-gray-400'}`}>Upload Data</span>
               <div className="w-10 h-0.5 bg-gray-300"></div>
               <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold text-sm`}>3</div>
               <span className="text-gray-400">Results</span>
             </div>
           </div>
        )}

        {/* Step 1: Field Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">What is your target internship?</h2>
            <p className="text-gray-500 text-center mb-10">Select the domain you are applying for to calibrate the AI.</p>
            <FieldSelector selectedField={field} onSelect={handleFieldSelect} />
          </div>
        )}

        {/* Step 2: File Upload */}
        {step === 2 && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Upload your Portfolio</h2>
              <p className="text-gray-500 mt-2">Target Field: <span className="font-semibold text-indigo-600 uppercase">{field}</span></p>
            </div>
            
            <FileUpload onFileLoaded={handleFileLoaded} />
            
            {fileName && (
              <div className="mt-6 flex flex-col items-center space-y-4">
                <div className="text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full border border-green-100 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Ready to analyze
                </div>
                <button
                  onClick={handleAnalysis}
                  disabled={loading}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex justify-center items-center gap-2
                    ${loading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'}
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing with Gemini AI...
                    </>
                  ) : (
                    'Analyze Match Score'
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <button onClick={() => setStep(1)} className="mt-6 text-gray-400 text-sm hover:text-gray-600 block mx-auto">
              ← Back to Field Selection
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <ResultsDashboard result={result} onReset={handleReset} />
        )}

      </main>
    </div>
  );
};

export default App;