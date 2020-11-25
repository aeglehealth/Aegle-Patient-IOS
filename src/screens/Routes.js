import {StyleSheet} from 'react-native';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {fromBottom, fadeIn} from 'react-navigation-transitions';

import AuthLoadingScreen from './AuthLoadingScreen';
import Home from './App/HomeNavigator';
import Question from './App/QuestionPage';
import Question2 from './App/QuestionPage2';
import SymptomSearch from './App/SymptomSearchPage';
import MentalAssessment from './App/MentalAssessmentPage';
import MentalAssessmentBookOption from './App/MentalAssessmentBookOptionPage';
import BookAppointment from './App/BookAppointmentPage';
import TalkToDoctor from './App/TalkToDoctorPage';
import AppointmentSchedule from './App/AppointmentSchedulePage';
import AppointmentFor from './App/AppointmentForPage';
import AppointmentDetail from './App/AppointmentDetailPage';
import ConsultantType from './App/ConsultantTypePage';
import FamilyQuestions from './App/FamilyQuestionsPage';
import FamilyDetail from './App/FamilyDetailPage';
import AppointmentTime from './App/AppointmentTimePage';
import MonitorHealthStart from './App/MonitorHealthStartPage';
import MonitorHealthAssessment from './App/MonitorHealthAssessmentPage';
import MonitorHealthChat from './App/MonitorHealthChatPage';
import MonitorHealthChat2 from './App/MonitorHealthChat2';
import ConditionLibrary from './App/ConditionLibraryPage';
import ConditionLibraryDetail from './App/ConditionLibraryDetailPage';
import DoctorProfile from './App/DoctorProfilePage';
import PrescriptionsList from './App/PrescriptionsListPage';
import PrescriptionDetail from './App/PrescriptionDetailPage';
import MyAssessments from './App/MyAssessmentsPage';
import CreateComment from './App/CreateCommentPage';
import CreatePost from './App/CreatePostPage';
import PostDetail from './App/PostDetailPage';
import ReportPost from './App/ReportPostPage';
import TaggedPost from './App/TaggedPostsPage';
import TaggedPost2 from './App/TaggedPostsPage2';
import Profile from './App/ProfileNavigator';
import DoctorNote from './App/DoctorNoteNavigator';
import Appointments from './App/AppointmentNavigator';
import ChangePassword from './App/ChangePasswordPage';
import ClinicalRecords from './App/ClinicalRecordsPage';
import MedicalHistoryList from './App/MedicalHistoryListPage';
import MedicalHistoryEdit from './App/MedicalHistoryEditPage';
import MedicationList from './App/MedicationListPage';
import MedicationEdit from './App/MedicationEditPage';
import AllergyList from './App/AllergyListPage';
import ChatList from './App/ChatListPage';
import CardList from './App/CardListPage';
import AllergyEdit from './App/AllergyEditPage';
import FamilyList from './App/FamilyListPage';
import Subscription from './App/SubscriptionPage';
import SubscriptionPlans from './App/SubscriptionPlansPage';
import CodeInput from './App/SubscriptionPlansPage/CodeInput';
import SubscriptionOrderDetail from './App/SubscriptionOrderDetailPage';
import Membership from './App/MembershipPage';
import MembershipType from './App/MembershipTypePage';
import BillingHistory from './App/BillingHistoryPage';
import InsuranceDetail from './App/InsuranceDetailPage';
import About from './App/AboutPage';
import FAQ from './App/FAQPage';
import ContactUs from './App/ContactPage';
import Settings from './App/SettingsPage';
import VideoChat from './App/VideoChat';
import VoiceChat from './App/VoiceChat';
import Chat from '../Components/Chat';
import Ratings from '../Components/RatingsPage';

import CompletedAction from '../Components/CompletedActionPage';

import Report from './Report/ReportPage';
import AssessmentDetail from './Report/AssessmentDetailPage';
import RatingQuestion from './Report/RatingQuestionPage';
import AssessmentReportage from './Report/MyAssessmentDetail';
import MonitorHealthReport from './Report/MonitorHealthReport';

import Welcome from './WelcomePage';
import AuthEntry from './Auth/AuthEntryPage';
import SignUpChoices from './Auth/SignUpChoicesPage';
import SignInChoices from './Auth/SignInChoicesPage';
import SignUpEmail from './Auth/SignUpEmail';
import ChoosePassword from './Auth/SignUpPassword';
import SignUpName from './Auth/SignUpName';
import Phone from './Auth/SignUpPhoneNumber';
import SignUpNumberVerification from './Auth/SignUpNumberVerificationPage';
import Terms from './Auth/TermsPage';
import AuthSubscription from './Auth/SubscriptionPage';
import CardPayment from './Auth/CardPaymentPage';
import SignInEmail from './Auth/SignInEmailPage';
import ForgotPassword from './Auth/ForgotPasswordPage';
import ForgotPassword2 from './Auth/ForgotPasswordInput';
import MedicalHistoryAdd from './App/MedicalHistoryAddPage';
import AllergyAdd from './App/AllergyAddPage';
import MedicationAddPage from './App/MedicationAddPage';
import AssessmentFollowUp from './App/AssessmentFollowUp';
import PayStack from './Auth/PaystackCard';
import OauthNumberPage from './Auth/OauthNumberPage';
import FamilyMemberUpdate from './App/FamilyMemberUpdate';
import ShowImage from '../Components/showImage';
const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#000',
    shadowColor: '#000',
    elevation: 0,
    borderBottomColor: '#000',
    shadowOpacity: 0,
  },
  headerStyleBlue: {
    backgroundColor: '#1B2CC1',
    shadowColor: '#fff',
    elevation: 0,
    borderBottomColor: '#1B2CC1',
    shadowOpacity: 0,
  },
});

const AppStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
        headerMode: 'none',
      },
    },
    ShowImage: {
      screen: ShowImage,
      navigationOptions: {
        header: null,
      },
    },
    AllergyList,
    AllergyEdit,
    SymptomSearch,
    BillingHistory,
    BookAppointment,
    AppointmentSchedule,
    AppointmentFor,
    AppointmentDetail,
    ConsultantType,
    CardPayment,
    AppointmentTime,
    CompletedAction,
    ConditionLibrary,
    ConditionLibraryDetail,
    ChatList,
    CardList,
    ContactUs,
    DoctorProfile,
    FAQ,
    FamilyQuestions,
    FamilyDetail,
    InsuranceDetail,
    MedicalHistoryList,
    MedicalHistoryEdit,
    MedicationList,
    MedicationEdit,
    MentalAssessment,
    MentalAssessmentBookOption,
    MonitorHealthStart,
    MonitorHealthAssessment,
    MonitorHealthChat,
    MyAssessments,
    PrescriptionsList,
    PrescriptionDetail,
    Question,
    Question2,
    CodeInput,
    SubscriptionOrderDetail,
    TalkToDoctor,
    AssessmentReport: {
      screen: Report,
    },
    AssessmentReportDetail: {
      screen: AssessmentDetail,
    },
    CreateComment,
    CreatePost,
    PostDetail,
    ReportPost,
    TaggedPost,
    TaggedPost2,
    Profile,
    DoctorNote: {
      screen: DoctorNote,
      navigationOptions: {
        headerStyle: styles.headerStyleBlue,
        headerTintColor: '#fff',
        title: "Doctor's Note",
      },
    },
    ChangePassword,
    ClinicalRecords,
    FamilyList,
    Subscription,
    SubscriptionPlans,
    Membership,
    MembershipType,
    Appointments: {
      screen: Appointments,
    },
    About,
    Settings,
    VideoChat,
    VoiceChat,
    Chat,
    MedicalHistoryAdd,
    AllergyAdd,
    MedicationAddPage,
    AssessmentReportage,
    AssessmentFollowUp,
    MonitorHealthReport,
    PayStack,
    MonitorHealthChat2,
    Ratings,
    FamilyMemberUpdate,
  },
  {
    initialRouteName: 'Home',
    transitionConfig: nav => handleCustomTransition(nav),
  },
);

const AuthStack = createStackNavigator(
  {
    PayStack,
    Welcome,
    AuthEntry,
    SignUpChoices,
    SignUpEmail,
    SignUpNumberVerification,
    Terms,
    AuthSubscription,
    CardPayment,
    SignInChoices,
    SignInEmail,
    ForgotPassword,
    ForgotPassword2,
    CompletedAction,
    SignUpName,
    ChoosePassword,
    Phone,
    OauthNumberPage,
  },
  {
    initialRouteName: 'Welcome',
  },
);

const ReportStack = createStackNavigator(
  {
    Report,
    ReportDetail: {
      screen: AssessmentDetail,
    },
    RatingQuestion,
  },
  {
    initialRouteName: 'Report',
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Report: ReportStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

const handleCustomTransition = ({scenes}) => {
  if (scenes.length < 2) {
    return;
  }
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if (prevScene.route.routeName === 'Home') {
    if (nextScene.route.routeName !== 'Profile') {
      return fromBottom(500);
    }
  }
  return fadeIn(100);
};
