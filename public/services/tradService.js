myApp.factory('tradService', function () {
    var serv = {};

    serv.translateTable = {
        'user': {
             'USER_EMPTY': 'All fields are empty',
             'USER_CREATE_SUCCESS': 'User successfully created',
             'CHAMP_VIDE': 'Please fill in all fields',
             'PASSWORD_EMPTY': 'The password field is empty',
             'PASSWORD_CONFIRM_EMPTY': 'The password confirmation field is empty',
             'EMAIL_EMPTY': 'The email field is empty',
             'INVALID_EMAIL': 'The email field is invalid',
             'USER_ALREADY_EXIST': 'The user already exists',
             'PASSWORD_DIFFERENT': 'The password and confirmation are different',
             'LOGIN_SUCCESS': 'Login successfully',
             'LOGIN_FAIL': 'Incorrect email or password',
             'USER_LOGOUT': 'Logout successfully',
             'MUST_LOGGED': 'You must be authenticated to access this service',
             'NOT_LOGGED': 'Not authenticated',
             'INVALID_TOKEN': 'Your token is invalid',
             'USER_UPDATED': 'User updated',
             'PLAYLIST_ALREADY_EXIST':'The playlist name already exists',
             'VIDEO_ALREADY_ADDED':'The video already exists in this playlist',
             'ADD_VIDEO_SUCCESS':'Added to the playlist successfully',
             'REMOVE_VIDEO_SUCCESS':'Removed from playlist successfully'
        },
        'todo': {
             'TASKNAME_EMPTY': 'The task is empty',
             'INVALID_TOKEN': 'Your identification token is invalid',
             'NO_TOKEN': 'You must be authenticated to access this service'
        }
    };

    serv.get = function (cat, key) {
        return serv.translateTable[cat][key];
    }

    return serv;
});
