import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// candidates routing
const CandidatePage = Loadable(lazy(() => import('views/candidates')));
const FormCandidatePage = Loadable(lazy(() => import('views/candidates/FormCandidatePage')));
const CandidateDetailPage = Loadable(lazy(() => import('views/candidates/CandidateDetailPage')));
const CandidateReviewPage = Loadable(lazy(() => import('views/candidates/CandidateReviewPage')));

// interview-kit routing
const InterviewKitPage = Loadable(lazy(() => import('views/interview')));
const FormInterviewKitPage = Loadable(lazy(() => import('views/interview/FormInterviewKitPage')));

// position routing
const PositionPage = Loadable(lazy(() => import('views/position')));
const FormPositionPage = Loadable(lazy(() => import('views/position/FormPositionPage')));

// user routing
const UserPage = Loadable(lazy(() => import('views/user')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: '',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'candidate',
            children: [
                {
                    path: '',
                    element: <CandidatePage />
                },
                {
                    path: 'new',
                    element: <FormCandidatePage />
                },
                {
                    path: ':id/detail',
                    element: <CandidateDetailPage />
                },
                {
                    path: ':id/detail/:interviewId/interview',
                    element: <CandidateReviewPage />
                }
            ]
        },
        {
            path: 'interview-kit',
            children: [
                {
                    path: '',
                    element: <InterviewKitPage />
                },
                {
                    path: 'new',
                    element: <FormInterviewKitPage />
                },
                {
                    path: ':id/edit',
                    element: <FormInterviewKitPage />
                }
            ]
        },
        {
            path: 'position',
            children: [
                {
                    path: '',
                    element: <PositionPage />
                },
                {
                    path: 'new',
                    element: <FormPositionPage />
                },
                {
                    path: ':id/edit',
                    element: <FormPositionPage />
                }
            ]
        },
        {
            path: 'user',
            children: [
                {
                    path: '',
                    element: <UserPage />
                }
            ]
        }
    ]
};

export default MainRoutes;
