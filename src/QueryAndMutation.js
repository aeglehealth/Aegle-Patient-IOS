import {gql} from 'apollo-boost';

export const SIGN_IN = gql`
  mutation(
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $password: String!
    $email: String!
  ) {
    registerPatient(
      data: {
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        password: $password
        email: $email
      }
    ) {
      user {
        provider
        sub
        role
      }
      token
    }
  }
`;

export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(data: {email: $email, password: $password}) {
      user {
        provider
      }
      token
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      isEmailVerified
      provider
      isPhoneVerified
      authorization {
        id
        last4
        expYear
        expMonth
      }
      profile {
        id
        firstName
        lastName
        gender
        dateOfBirth
        phoneNumber
        address
        country
        height
        weight
        smoker
        age
        postalCode
        medicalCert
        cv
      }
      createdAt
      local {
        email
      }
    }
  }
`;

export const MEPOST = gql`
  query {
    me {
      id
      families {
        id
        firstName
        lastName
        gender
        dateOfBirth
        photo {
          id
          original
          thumbnail
        }
      }
      isEmailVerified
      isPhoneVerified
      provider
      profile {
        id
        firstName
        lastName
        gender
        dateOfBirth
        phoneNumber
        address
        country
        height
        weight
        age
        smoker
        postalCode
        medicalCert
        cv
        photo {
          id
          original
          thumbnail
        }
      }
      local {
        email
      }
      devices {
        id
        fingerprint
        fcmToken
      }
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query {
    getPatientPosts {
      id
      tag
      commentsCount
      likes {
        id
        likedBy {
          id
          local {
            email
          }
        }
      }
      likesCount
      owner {
        id
        profile {
          id
          lastName
          firstName
          photo {
            id
            original
            thumbnail
          }
        }
      }
      title
      body
      createdAt
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation(
    $firstName: String
    $lastName: String
    $phoneNumber: String
    $gender: Gender
    $dateOfBirth: DateTime
    $password: String
    $height: String
    $weight: String
    $smoker: Boolean
    $address: String
    $postalCode: String
    $country: String
    $cv: String
    $photo: PhotoDTO
  ) {
    updateUser(
      data: {
        firstName: $firstName
        lastName: $lastName
        password: $password
        phoneNumber: $phoneNumber
        gender: $gender
        dateOfBirth: $dateOfBirth
        height: $height
        weight: $weight
        smoker: $smoker
        address: $address
        postalCode: $postalCode
        country: $country
        cv: $cv
        photo: $photo
      }
    ) {
      id
      provider
      profile {
        id
        firstName
        lastName
        gender
        dateOfBirth
        phoneNumber
        height
        weight
        smoker
        country
        postalCode
        address
        photo {
          id
          original
          thumbnail
        }
        cv
      }
      facebook {
        email
      }
      google {
        email
      }
      local {
        email
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation($newPassword: String!, $oldPassword: String!) {
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword)
  }
`;

export const PHONENUMBER_VERIFICATION = gql`
  mutation {
    sendPhoneVerification {
      message
      code
    }
  }
`;

export const CODE_VERIFICATION = gql`
  mutation($code: String!) {
    verifyCode(code: $code) {
      message
      code
    }
  }
`;

export const SEND_RESET_MAIL = gql`
  mutation sendResetEmail($email: String!) {
    sendResetEmail(email: $email)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation resetPassword($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token)
  }
`;

export const CREATE_APPOINTMENT = gql`
  mutation($data: AppointmentDTO!) {
    createAppointment(data: $data) {
      id
      consultationType
      time
      date
      meansOfContact
      homeVisit {
        id
        city
        address
        state
        timestamp
      }
      additionalNotes
      owner {
        id
        local {
          email
        }
        google {
          googleId
          email
        }
        facebook {
          email
          facebookId
        }
      }
      belongsTo
      family {
        id
        firstName
        lastName
        gender
        dateOfBirth
        appointments {
          id
          consultationType
        }
      }
      status
      rating {
        id
        rating
        ratedBy {
          id
          profile {
            id
            firstName
            lastName
            photo {
              id
              original
              thumbnail
            }
          }
        }
      }
      cancellationReason
      createdAt
      updatedAt
    }
  }
`;

export const POSTS = gql`
  query {
    getPosts {
      id
      tag
      commentsCount
      likesCount
      likes {
        id
        likedBy {
          id
          local {
            email
          }
        }
      }
      owner {
        id
        profile {
          id
          lastName
          firstName
          photo {
            id
            original
            thumbnail
          }
        }
      }
      title
      isAnonymous
      body
      createdAt
    }
  }
`;

export const NewPOST = gql`
  mutation($tag: ForumTag!, $body: String!, $isAnonymous: Boolean) {
    createPost(data: {tag: $tag, body: $body, isAnonymous: $isAnonymous}) {
      id
      tag
      owner {
        id
        profile {
          id
          lastName
          firstName
          photo {
            id
            original
            thumbnail
          }
        }
      }
      title
      body
      createdAt
    }
  }
`;

export const COMMENT = gql`
  query($forumId: String!) {
    getComments(forumId: $forumId) {
      id
      comment
      isAnonymous
      likesCount
      timestamp
      owner {
        id
        profile {
          id
          firstName
          lastName
          photo {
            id
            original
            thumbnail
          }
        }
      }
    }
  }
`;

export const NewCOMMENT = gql`
  mutation($postId: String!, $comment: String!, $isAnonymous: Boolean) {
    createComment(
      data: {postId: $postId, comment: $comment, isAnonymous: $isAnonymous}
    ) {
      id
      owner {
        id
        profile {
          id
          lastName
          firstName
          photo {
            id
            original
            thumbnail
          }
        }
      }
      comment
    }
  }
`;

export const ADD_FAMILY_MEMBER = gql`
  mutation($famData: FamilyDTO!) {
    addfamily(famData: $famData) {
      id
      firstName
      lastName
      gender
      dateOfBirth
      appointments {
        id
        time
        date
      }
    }
  }
`;

export const UPDATE_FAMILY_MEMBER = gql`
  mutation($data: updateFamilyDTO!, $familyId: String!) {
    updateFamilyMember(data: $data, familyId: $familyId) {
      id
    }
  }
`;

export const APPOINTMENTS = gql`
  query {
    patientAppointments {
      id
      consultationType
      time
      date
      meansOfContact
      homeVisit {
        id
        address
        city
        state
        timestamp
      }
      additionalNotes
      attachments {
        id
        name
        url
      }
      owner {
        id
        profile {
          id
          firstName
          lastName
          phoneNumber
          dateOfBirth
          photo {
            id
            original
            thumbnail
          }
          gender
        }
      }
      approvedBy {
        id
        profile {
          id
          firstName
          lastName
          phoneNumber
          dateOfBirth
          age
          photo {
            id
            original
            thumbnail
          }
          gender
          cv
          medicalCert
          license
          address
          postalCode
          country
          height
          weight
          education
          bio
          speciality
          currentPlaceOfWork
          medicalSchool {
            id
            school
            location
          }
        }
      }
      belongsTo
      family {
        id
        firstName
        lastName
        gender
        dateOfBirth
        photo {
          id
          original
          thumbnail
        }
      }
      status
      rating {
        id
        rating
        ratedBy {
          id
        }
      }
      cancellationReason
      createdAt
      updatedAt
    }
  }
`;

export const CANCEL_APPOINTMENT = gql`
  mutation($data: CancelAppointmentDTO!) {
    cancelAppointment(data: $data) {
      id
    }
  }
`;

export const RESCHEDULE_APPOINTMENT = gql`
  mutation($data: RescheduleDTO!) {
    rescheduleAppointment(data: $data) {
      id
      date
      time
    }
  }
`;

export const DELETE_FAMILY_MEMBER = gql`
  mutation($familyId: String!) {
    deleteFamilyMember(familyId: $familyId)
  }
`;

export const UPLOAD_FILE = gql`
  mutation($file: Upload!) {
    addPhoto(file: $file) {
      id
      name
      url
    }
  }
`;

export const UPLOAD = gql`
  mutation($file: Upload!) {
    uploadFile(file: $file) {
      thumbnail
      original
    }
  }
`;

export const Appointment_Created_Subscription = gql`
  subscription($OwnerId: String!) {
    emitAppointmentCreated(OwnerId: $OwnerId) {
      OwnerName
      Message
      ConsultationDate
      ConsultationDate
      Id
      Status
      CreatedAt
    }
  }
`;

export const Appointment_Approved_Subscription = gql`
  subscription($OwnerId: String!) {
    emitAppointmentWhereDoctorIsApproved(OwnerId: $OwnerId) {
      OwnerName
      Message
      ConsultationDate
      ConsultationDate
      Id
      Status
      CreatedAt
    }
  }
`;

export const Appointment_Reached_Subscription = gql`
  subscription($OwnerId: String!) {
    emitGetNotificationWhenAppointmentIsReached(OwnerId: $OwnerId) {
      OwnerName
      Message
      ConsultationDate
      ConsultationDate
      Id
      Status
      CreatedAt
    }
  }
`;

export const Appointment_Three_Days_Away_Subscription = gql`
  subscription($OwnerId: String!) {
    emitAppointmentsThreeDaysFromNow(OwnerId: $OwnerId) {
      OwnerName
      Message
      ConsultationDate
      ConsultationDate
      Id
      Status
      CreatedAt
    }
  }
`;

// MEDICAL HISTORY
export const GET_MEDICAL_HISTORY = gql`
  query {
    getAllPatientMedicalHistory {
      id
      title
      description
    }
  }
`;

export const ADD_MEDICAL_HISTORY = gql`
  mutation($data: medicalHistoryDTO!) {
    addMedicalHistory(data: $data) {
      id
      title
      description
    }
  }
`;

export const UPDATE_MEDICAL_HISTORY = gql`
  mutation($data: updateMedicalHistoryDTO!, $medicalHistoryId: String!) {
    updateMedicalHistory(data: $data, medicalHistoryId: $medicalHistoryId) {
      id
      title
      description
    }
  }
`;

// ALERGIES
export const GET_ALLERGIES = gql`
  query {
    getAllPatientAllergies {
      id
      title
      description
    }
  }
`;

export const ADD_ALLERGY = gql`
  mutation($data: allergyDTO!) {
    addAllergy(data: $data) {
      id
      title
      description
    }
  }
`;

export const UPDATE_ALLERGY = gql`
  mutation($data: updateAllergyDTO!, $allergyId: String!) {
    updateAllergy(data: $data, allergyId: $allergyId) {
      id
      title
      description
    }
  }
`;

// MEDICATION
export const GET_MEDICATION = gql`
  query {
    getAllPatientMedications {
      id
      title
      description
    }
  }
`;

export const ADD_MEDICATION = gql`
  mutation($data: medicationDTO!) {
    addMedication(data: $data) {
      id
      title
      description
    }
  }
`;

export const UPDATE_MEDICATION = gql`
  mutation($data: updateMedicationDTO!, $medicationId: String!) {
    updateMedication(data: $data, medicationId: $medicationId) {
      id
      title
      description
    }
  }
`;

export const SUBSCRIBE_PLAN = gql`
  mutation($data: MobileInitializationInput!) {
    initializePaymentOnMobile(data: $data) {
      authorizationUrl
      status
      reference
    }
  }
`;

export const HOME_VISIT = gql`
  mutation($data: InitializaInput!) {
    initializePayment(data: $data) {
      authorizationUrl
      status
      reference
    }
  }
`;

export const JOIN_VIDEO_CALL = gql`
  mutation($data: joinVideoCallDTO!) {
    joinVideoCall(data: $data) {
      room
      token
      sessionId
      appointmentId
      subject
    }
  }
`;

export const JOIN_VOICE_CALL = gql`
  mutation($data: joinVideoCallDTO!) {
    joinVoiceCallAsVideo(data: $data) {
      room
      token
      sessionId
      appointmentId
      subject
    }
  }
`;

export const JoinChatMutation = gql`
  mutation($data: joinChatDTO!) {
    joinChat(data: $data) {
      token
      sessionId
      identity
      appointmentId
    }
  }
`;

export const GetAppointmentById = gql`
  query($appointmentId: String!) {
    getAppointmentById(appointmentId: $appointmentId) {
      id
      time
      session {
        id
        room
      }
      approvedBy {
        id
        profile {
          id
          firstName
          lastName
          photo {
            id
            thumbnail
            original
          }
        }
      }
    }
  }
`;

// GET REFERRAL
export const GET_REFFERAL = gql`
  query($appointmentId: String!) {
    getReferral(appointmentId: $appointmentId) {
      id
      title
      description
      appointment {
        id
        date
        time
        approvedBy {
          id
          profile {
            id
            firstName
            lastName
            photo {
              id
              original
              thumbnail
            }
          }
        }
      }
    }
  }
`;

// GET PRESCRIPTION
export const GET_PRESCRIPTION = gql`
  query($appointmentId: String!) {
    getPrescription(appointmentId: $appointmentId) {
      id
      title
      description
      appointment {
        id
        date
        time
        approvedBy {
          id
          profile {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;
export const GET_PRESCRIPTIONS = gql`
  query($appointmentId: String!) {
    getPrescriptions(appointmentId: $appointmentId) {
      id
      title
      description
      dose
      appointment {
        id
        date
        time
        approvedBy {
          id
          profile {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;
export const GET_ALL_PATIENT_PRESCRIPTIONS = gql`
  query($userId: String!) {
    getAllPatientPrescriptions(userId: $userId) {
      id
      title
      description
      appointment {
        id
        time
        date
        approvedBy {
          id
          profile {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;

// GET REPORT
export const GET_REPORT = gql`
  query($appointmentId: String!) {
    getReport(appointmentId: $appointmentId) {
      id
      title
      description
      appointment {
        id
        date
        time
        approvedBy {
          id
          profile {
            id
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const CREATE_ASSESSMENT = gql`
  mutation($payload: CollectAssesmentDTO!) {
    createPatientAssesment(payload: $payload) {
      Id
      UserId
      User {
        id
      }
      DateCreated
      PatientAssesmentCausesList {
        Name
        PatientAssesmentId
      }
    }
  }
`;

export const GET_ALL_ASSESSMENTS = gql`
  query($data: String!) {
    getPatientAssesmentsByPerson(userId: $data) {
      Id
      DateCreated
      PatientAssesmentCausesList {
        Id
        Name
        PatientAssesmentId
      }
      PatientAssesmentSymptomsList {
        Id
        Name
        SymptomType
        PatientAssesmentId
      }
      User {
        id
        role
        provider
      }
    }
  }
`;

export const ASSESSMENT_BY_ID = gql`
  query($id: String!) {
    getPatientAssesment(assesmentId: $id) {
      Id
      DateCreated
      PatientAssesmentCausesList {
        Id
        Name
        PatientAssesmentId
      }
      PatientAssesmentSymptomsList {
        Name
        SymptomType
        PatientAssesmentId
        Id
        DateCreated
      }
    }
  }
`;

export const DELETE_ASSESSMENT = gql`
  mutation($id: String!) {
    deletePatientAssesmentRecord(assesmentId: $id) {
      Message
      OperationStatus
    }
  }
`;

export const GET_PLANS = gql`
  query {
    getPlans {
      id
      name
      code
      amount
    }
  }
`;

export const LIKE_POST = gql`
  mutation($forumId: String!) {
    addForumLike(forumId: $forumId) {
      id
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation($commentId: String!) {
    addCommentLike(commentId: $commentId) {
      id
    }
  }
`;

export const DELETE_CARD = gql`
  mutation($cardId: String!) {
    deleteUserCard(cardId: $cardId) {
      Message
      OperationStatus
    }
  }
`;

export const GET_USER_CARDS = gql`
  query {
    getUserCards {
      id
      countryCode
      code
      expMonth
      expYear
      last4
      cardType
      brand
      reusable
      signature
      bank
      channel
      owner {
        id
        profile {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const CREATE_CARD = gql`
  mutation($cardDetail: CreateAuthorizationDTO!) {
    createCard(cardDetail: $cardDetail) {
      id
      countryCode
      code
      expMonth
      expYear
      last4
      cardType
      brand
      reusable
      signature
      bank
      channel
      owner {
        id
        profile {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const UPGRADE_DOWNGRADE_SUB = gql`
  mutation($data: downgradeOrUpgradeSubscriptionDTO!) {
    downgradeOrupgradeSubscription(data: $data) {
      authorizationUrl
      status
      reference
    }
  }
`;

export const GOOGLE_SIGNUP = gql`
  mutation($data: GoogleOAuthDTO!) {
    signUpWithGoogle(data: $data) {
      user {
        sub
        role
      }
      token
    }
  }
`;

export const GOOGLE_SIGNIN = gql`
  mutation($data: GoogleOAuthDTO!) {
    signInWithGoogle(data: $data) {
      user {
        sub
        role
      }
      token
    }
  }
`;

export const FACEBOOK_SIGNIN = gql`
  mutation($accessToken: String!) {
    signInWithFacebook(accessToken: $accessToken) {
      user {
        role
      }
      token
    }
  }
`;

export const FACEBOOK_SIGNUP = gql`
  mutation($accessToken: String!) {
    signUpWithFacebook(accessToken: $accessToken) {
      user {
        role
      }
      token
    }
  }
`;

export const RATING = gql`
  mutation($data: RatingDTO!) {
    addRating(data: $data) {
      id
      rating
    }
  }
`;

export const COMPLETE_APPOINTMENT = gql`
  mutation($appointmentId: String!) {
    completeAppointment(appointmentId: $appointmentId) {
      id
      rating {
        id
        rating
        ratedBy {
          id
          profile {
            id
            firstName
            lastName
          }
        }
      }
      approvedBy {
        id
        profile {
          id
          firstName
          lastName
          phoneNumber
          photo {
            id
            original
            thumbnail
          }
          gender
          address
          country
          postalCode
        }
      }
    }
  }
`;

export const ADD_DEVICE = gql`
  mutation($data: DevicesDTO!) {
    addDevice(data: $data) {
      id
      fingerprint
    }
  }
`;

export const UPDATE_DEVICE = gql`
  mutation($oldFingerprint: String!, $data: DevicesDTO!) {
    udpateDevice(data: $data, oldFingerprint: $oldFingerprint) {
      id
      fingerprint
      fcmToken
    }
  }
`;

export const NOTIFICATION = gql`
  query {
    getNotifications {
      id
      type
      title
      action
      message
      createdAt
      isRead
      url
      appointment {
        id
        consultationType
        date
        status
        meansOfContact
        session {
          id
          room
        }
      }
      owner {
        id
        profile {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const SUBSCRIPTION_LIST = gql`
  query {
    subscriptionList {
      entity
      total
      plans {
        _id
        entity
        name
        billingType
        price
        previousPrice
        role
        packages {
          title
        }
      }
    }
  }
`;

export const ACTIVE_SUBSCRIPTION = gql`
  query {
    activeUserSubscriptions {
      _id
      entity
      renew
      name
      billingType
      price
      role
      duration {
        value
        unit
        text
      }
      expiresIn
      subscription
    }
    me {
      id
      profile {
        id
        firstName
        lastName
        photo {
          id
          original
          thumbnail
        }
      }
      local {
        email
      }
    }
  }
`;

export const PAY = gql`
  mutation($pay: PayDTO!) {
    pay(data: $pay) {
      statusCode
      status
      message
      data {
        status
        message
        data {
          status
          reference
          url
        }
      }
    }
  }
`;

export const SUBMIT_PIN = gql`
  mutation($data: SubmitPinDTO!) {
    submitPin(data: $data) {
      statusCode
      status
      message
      data {
        status
        message
        data {
          status
          reference
          url
        }
      }
    }
  }
`;

export const SUBMIT_OTP = gql`
  mutation($data: SubmitOtpDTO!) {
    submitOTP(data: $data) {
      statusCode
      status
      message
      data {
        status
        message
        data {
          status
          reference
          url
        }
      }
    }
  }
`;

export const SUBMIT_PHONE = gql`
  mutation($data: SubmitPhoneDTO!) {
    submitPhone(data: $data) {
      statusCode
      status
      message
      data {
        status
        message
        data {
          status
          reference
          url
        }
      }
    }
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation($data: CancelSubDTO!) {
    cancelSubscription(data: $data) {
      _id
      type
      entity
      name
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation($data: MarkNotificationDTO!) {
    markNotificationsAsRead(data: $data)
  }
`;

export const UNREAD_NOTIFICATION_COUNT = gql`
  query {
    unreadNotificationCount
  }
`;

export const START_VIDEO_CALL = gql`
  subscription {
    videoStarted {
      room
      token
      sessionId
      appointmentId
      subject
    }
  }
`;

export const APPLY_PROMOTION = gql`
  mutation($code: String!) {
    applyPromotion(code: $code) {
      statusCode
      status
      message
    }
  }
`;

export const CHECK_SUBSCRIPTION_STATUS = gql`
  query($ref: String!) {
    checkStatus(reference: $ref) {
      statusCode
      status
      message
      data {
        status
        message
      }
    }
  }
`;
