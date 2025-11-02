'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import AppHeader from '../../../_component/AppHeader'
import { 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Target,
  Star,
  MessageSquare,
  BarChart3,
  Award,
  AlertCircle,
  Download,
  Share2,
  Home,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import { evaluateInterview, EvaluationResult } from '@/lib/geminiEvaluation'

function InterviewFeedback() {
  const { interviewid } = useParams<{ interviewid: string }>();
  const router = useRouter();
  const [isEvaluating, setIsEvaluating] = useState(true);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Query interview data
  const interviewData = useQuery(api.Interview.GetInterviewFeedback, {
    interviewId: interviewid as Id<"InterviewSessionTable">,
  });

  useEffect(() => {
    if (interviewData && interviewData.transcript) {
      evaluateWithGemini();
    }
  }, [interviewData]);

  const evaluateWithGemini = async () => {
    if (!interviewData) return;

    setIsEvaluating(true);
    setError(null);

    try {
      const result = await evaluateInterview(
        interviewData.transcript || [],
        interviewData.jobTitle || 'Unknown Position',
        interviewData.jobDescription || 'No description',
        (interviewData.interviewQuestions || []).map((q: any) => 
          typeof q === 'string' ? q : q?.question || ''
        )
      );

      setEvaluation(result);
    } catch (err) {
      console.error('Evaluation error:', err);
      setError('Failed to generate evaluation. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isEvaluating || !interviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-20 h-20 text-blue-500 animate-spin mx-auto mb-6" />
          <div className="text-white text-2xl font-semibold mb-2">
            AI is Analyzing Your Interview...
          </div>
          <p className="text-gray-400">Evaluating responses with Gemini AI</p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Evaluation Failed</h2>
            <p className="text-gray-400 mb-6">{error || 'Unable to generate feedback'}</p>
            <Button onClick={evaluateWithGemini}>
              Retry Evaluation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = evaluation.overallScore;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 60) return 'C';
    return 'D';
  };

  // Prepare data for radar chart
  const radarData = evaluation.scores.map(s => ({
    category: s.category.split(' ')[0], // Shortened labels
    score: s.score,
    fullMark: 100
  }));

  // Prepare data for bar chart
  const barData = evaluation.scores.map(s => ({
    name: s.category,
    score: s.score,
    color: getScoreColor(s.score)
  }));

  // Prepare data for pie chart (score distribution)
  const pieData = [
    { name: 'Score', value: overallScore, color: getScoreColor(overallScore) },
    { name: 'Remaining', value: 100 - overallScore, color: '#374151' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <AppHeader />
      
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Interview Evaluation Complete!
          </h1>
          <p className="text-gray-400 text-lg">
            Powered by Gemini AI Analysis
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-800/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Score Display & Pie Chart */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-gray-400 text-sm mb-2">Overall Performance</div>
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold" style={{ color: getScoreColor(overallScore) }}>
                    {overallScore}
                  </div>
                  <div className="text-gray-400 text-sm">out of 100</div>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-6 py-2 rounded-full text-xl font-semibold`}
                  style={{ 
                    backgroundColor: `${getScoreColor(overallScore)}20`,
                    color: getScoreColor(overallScore)
                  }}>
                  Grade: {getScoreGrade(overallScore)}
                </span>
              </div>
            </div>

            {/* Right: Interview Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm text-gray-400">Position</div>
                  <div className="text-lg font-semibold">{interviewData?.jobTitle || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Questions Answered</div>
                  <div className="text-lg font-semibold">
                    {interviewData?.interviewQuestions?.length || 0} questions
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="text-lg font-semibold">
                    {interviewData?.duration ? `${Math.floor(interviewData.duration / 60)}m ${interviewData.duration % 60}s` : 'N/A'}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {evaluation.summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              Performance Radar
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" hide />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {evaluation.scores.map((score, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{score.category}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold" style={{ color: getScoreColor(score.score) }}>
                      {score.score}
                    </span>
                    <span className="text-gray-400">/ {score.maxScore}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold" style={{ color: getScoreColor(score.score) }}>
                    {getScoreGrade(score.score)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${score.score}%`,
                    backgroundColor: getScoreColor(score.score)
                  }}
                ></div>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                {score.feedback}
              </p>
            </div>
          ))}
        </div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-green-400">Key Strengths</h3>
            </div>
            <ul className="space-y-3">
              {evaluation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-300">
                  <Star className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-yellow-400">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {evaluation.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-300">
                  <TrendingUp className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
            Detailed Analysis
          </h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {evaluation.detailedFeedback}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-gray-600 hover:bg-gray-800"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-600 hover:bg-gray-800"
            onClick={evaluateWithGemini}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Re-evaluate
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewFeedback