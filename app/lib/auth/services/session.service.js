export default class Session {
    constructor(USER_ROLES, LocalStorage) {
        'ngInject';

        this.id = null;
        this.userName = null;
        this.userEmail = null;
        this.userRole = null;
        this.orcid = null;

        const SESSION_KEY = "SESSION_DATA";

        function setValues(obj, id, userName, userEmail, userRole, orcid) {
            obj.id = id;
            obj.userName = userName;
            obj.userEmail = userEmail;
            obj.userRole = userRole;
            obj.orcid = orcid;
        }

        function setInitValues(obj) {
            setValues(obj, null, null, null, USER_ROLES.public);
        }

        Object.assign(this, {
            init() {
                var data = LocalStorage.retrieve(SESSION_KEY);
                if (data != null) {
                    var orcid = data.length > 4 ? data[4] : null;
                    setValues(this, data[0], data[1], data[2], data[3], orcid);
                    return;
                }
                setInitValues(this);
            },

            create(sessionId, userName, userEmail, userRole, orcid) {
                setValues(this, sessionId, userName, userEmail, userRole, orcid);
                LocalStorage.store(SESSION_KEY, [sessionId, userName, userEmail, userRole, orcid]);
            },
            destroy() {
                setInitValues(this);
                LocalStorage.remove(SESSION_KEY);
            },
            isAnonymous () {
                return this.id === null;
            }
        });

        this.init();
    }
}