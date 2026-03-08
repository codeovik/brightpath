import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Users, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/girl-online-class.jpg'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        </div>

        <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-12 md:grid-cols-2 lg:px-8">
          <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-8">
            
            {/* Badge */}
            <div className="inline-flex group items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 transition-colors dark:border-blue-400/50 dark:bg-blue-900/25 dark:text-blue-400">
              <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
              <span>AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-4xl font-medium text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Unlock Your Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">BrightPath</span>
            </h1>
            
            <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300 md:text-sm leading-relaxed">
              Experience a personalized education journey with our cutting-edge, AI-powered platform. Master new skills faster and more effectively with adaptive curriculums.
            </p>

            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4">
              <Link
                to="/courses"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base text-white transition-all hover:bg-secondary text-primary-foreground"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-level-1 px-8 text-base text-white transition-all hover:bg-level-2 border-2 border-level-3"
              >
                See Students
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Certified Tutors</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Lifetime Access</span>
                </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-xl">
            {/* Decorative elements behind image */}
            <div className="absolute -top-4 -right-4 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl"></div>
            
            <div className="relative rounded-2xl bg-white/50 p-2 shadow-2xl ring-1 ring-gray-900/10 backdrop-blur-sm dark:bg-gray-900/50 dark:ring-white/10">
                <img 
                    src={heroImg} 
                    alt="Student learning online" 
                    className="aspect-[4/3] w-full rounded-xl object-cover shadow-md" 
                />
                
                {/* Floating Cards */}
                <div className="absolute -left-8 top-12 hidden md:flex items-center gap-3 rounded-xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-bounce-slow">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">100+ Courses</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Explore variety</p>
                    </div>
                </div>

                <div className="absolute -right-8 bottom-12 hidden md:flex items-center gap-3 rounded-xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-bounce-slow delay-700">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Expert Mentors</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Learn from best</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
  );
}