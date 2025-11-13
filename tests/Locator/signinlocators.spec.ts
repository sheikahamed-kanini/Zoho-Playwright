

export const signinlocators = {

signin1 : {Role: 'textbox' as const , name:'Email address or mobile number' },
nextbtn1 :{Role: 'button' as const, name :'Next'},
signin2: {Role: 'textbox' as const , name:'Enter your email, phone, or' },
nextbt2: {Role: 'button' as const, name :'Next'},
passwd: {Role:'textbox' as const,name:'Enter the password for'},
sign : {Role: 'button' as const, name: 'Sign in'},
nextbt3:{Role: 'button' as const,name:'Next'},
skip: {Role:'button' as const, name:'Skip setup'},
yes:{Role:'button' as const,name: 'Yes'},
attendance: {Role: 'listitem' as const, name: 'Attendance', child: 'i'},
actions: {Role:'button' as const, name:'Quick Actions'},
leave:{Role:'menuitem' as const, name:'Leave'},
select:{Role:'option' as const, name:'Select'},
earnedleave:{Role:'option' as const, name:'Earned Leave'},
// Leave Application Locators
leaveForm: {
    startDateContainer: '#zp_field_11653000000036109-container',
    endDateContainer: '#zp_field_11653000000036111-container',
    startDateInput: '#zp_field_11653000000036109-container input',
    endDateInput: '#zp_field_11653000000036111-container input',
    reasonContainer: '#reg_req_reason_0-container',
    reasonImg: 'img',
    reasonText: 'Work from home',
    descriptionField: { Role: 'textbox' as const, name: 'Reason for leave' },
    cancelBtn: { Role: 'button' as const, name: 'Cancel' },
    submitBtn: { Role: 'button' as const, name: 'Submit' }
}

}

