export class SubmissionTemplate {

    requiredColumns(itemType) {
        let attrs = (dict[itemType] || {attributes: []}).attributes;
        return _.filter(attrs, {required: true});
    }
}