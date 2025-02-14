/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dataShare from '@ohos.data.dataShare';
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from 'deccjsunit/index'

const URI_CONTACTS = "datashare:///com.ohos.contactsdataability";
const groupUri = "datashare:///com.ohos.contactsdataability/contacts/groups";
import common from './common.js';

describe('GroupsTest', function() {
    console.info('logMessage GroupsTest start! ');

    var array_two = 2;

    async function groupsQuery(map, tag)
    {
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info(tag + ': groupsQuery start ! dataShareHelper = ' + dataShareHelper);
        var resultColumns = [];
        let condition = new dataShare.DataSharePredicates();
        condition.equalTo("id", map.get("id"));
        try {
            var resultSet = await dataShareHelper.query(groupUri, resultColumns, condition);
            if (resultSet.rowCount > 0) {
                if (resultSet.goToFirstRow()) {
                    do {
                        for (var [key, value] of map) {
                            let dbresult = resultSet.getString(resultSet.getColumnIndex(key));
                            console.info(tag + ': logMessage groupsQuery key =' + key + 'dbresult :' + dbresult +
                                         ' value : ' + value);
                            expect(value == dbresult).assertTrue();
                        }
                    } while (resultSet.goToNextRow());
                }
            }
            resultSet.close();
        } catch (error) {
            console.info(tag + ': logMessage groupsQuery: error = ' + error);
        }
    }

    async function queryIdForDelete(map, tag)
    {
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info(tag + ': queryIdForDelete start ! dataShareHelper = ' + dataShareHelper);
        let resultColumns = common.getCallLogResultColumns();
        let condition = new dataShare.DataSharePredicates();
        condition.equalTo("id", map.get("id"));
        try {
            var resultSet = await dataShareHelper.query(groupUri, resultColumns, condition);
            expect(resultSet.goToFirstRow() == false).assertTrue();
            console.info(tag + " :logMessage queryIdForDelete: goToFirstRow " + resultSet.goToFirstRow());
            resultSet.close();
        } catch (error) {
            console.info(tag + " :logMessage queryIdForDelete: error = " + error);
        }
    }

    async function deleteAll(uri, tag)
    {
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        let condition = new dataShare.DataSharePredicates();
        condition.greaterThan("id", "0");
        var deleteCode = await dataShareHelper.delete(uri, condition);
        console.info(tag + ': deleteAll deleteCode = ' + deleteCode);
        expect(deleteCode == 0).assertTrue();
    }

    /**
     * @tc.number  group_insert_test_100
     * @tc.name    Insert group
     * @tc.desc    Function test
     */
    it("group_insert_test_100", 0, async function(done) {
        console.info("---------logMessage group_insert_test_100 is starting!----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        try {
            var groupId = await dataShareHelper.insert(groupUri, common.getProfileGroup());
            console.info("logMessage group_insert_test_100: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            var map = common.getProfileGroupMap();
            map.set("id", groupId.toString());
            await groupsQuery(map, "group_insert_test_100");
            await deleteAll(groupUri, "group_insert_test_100");
            done();
        } catch (error) {
            console.info("logMessage group_insert_test_100: group insert error = " + error);
            done();
        }
    });

    /**
     * @tc.number  group_update_test_500
     * @tc.name    Update group
     * @tc.desc    Function test
     */
    it("group_update_test_500", 0, async function(done) {
        console.info("---------logMessage group_update_test_500 is starting!----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        try {
            var groupId = await dataShareHelper.insert(groupUri, common.getProfileGroup());
            console.info("logMessage group_update_test_500: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            await GroupUpdate();
            await deleteAll(groupUri, "group_update_test_500");
            done();
        } catch (error) {
            console.info("logMessage group_update_test_500: group insert error = " + error);
            done();
        }

        async function GroupUpdate()
        {
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("id", groupId.toString());
            try {
                var updateCode = await dataShareHelper.update(groupUri, common.getProfileUpdateGroup(), condition);
                console.info("logMessage group_update_test_500: updateCode = " + updateCode);
                expect(updateCode == 0).assertTrue();
                var map = common.getProfileUpdateGroupMap();
                map.set("id", groupId.toStirng());
                await groupsQuery(map, "group_update_test_500");
            } catch (error) {
                console.info("logMessage group_update_test_500: update error = " + error);
                done();
            }
        }
    });

    /**
     * @tc.number  group_delete_test_200
     * @tc.name    Delete group
     * @tc.desc    Function test
     */
    it("group_delete_test_200", 0, async function(done) {
        console.info("---------logMessage group_delete_test_200 is starting!----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        try {
            var groupId = await dataShareHelper.insert(groupUri, common.getProfileGroup());
            console.info("logMessage group_delete_test_200: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            await GroupDelete();
            done();
        } catch (error) {
            console.info("logMessage group_delete_test_200: group insert error = " + error);
            done();
        }
        async function GroupDelete()
        {
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("id", groupId.toString());
            try {
                var deleteCode = await dataShareHelper.delete(groupUri, condition);
                console.info("logMessage group_delete_test_200 : deleteCode = " + deleteCode);
                expect(deleteCode == 0).assertTrue();
                var map = new Map();
                map.set("id", groupId.toString());
                await queryIdForDelete(map, "group_delete_test_200");
            } catch (error) {
                console.info("logMessage group_delete_test_200 : delete error = " + error);
                done();
            }
        }
    });

    /**
     * @tc.number  group_query_test_300
     * @tc.name    Query a group
     * @tc.desc    Function test
     */
    it("group_query_test_300", 0, async function(done) {
        console.info("------------logMessage group_query_test_300 is starting!-----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        try {
            var groupId = await dataShareHelper.insert(groupUri, common.getProfileGroup());
            console.info("logMessage group_query_test_300: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            var map = common.getProfileGroupMap();
            map.set("id", groupId.toString());
            await groupsQuery(map, "logMessage group_query_test_300");
            await deleteAll(groupUri, "group_query_test_300");
            done();
        } catch (error) {
            console.info("logMessage group_query_test_300: group insert error = " + error);
            done();
        }
    });

    /**
     * @tc.number  group_query_test_400
     * @tc.name    Query all groups
     * @tc.desc    Function test
     */
    it("group_query_test_400", 0, async function(done) {
        console.info("------------logMessage group_query_test_400 is starting!-----------");
        console.info("---------logMessage getDbHelper start!----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        console.info('logMessage uri = ' + URI_CONTACTS);
        var groupUri = "datashare:///com.ohos.contactsdataability/contacts/groups";

        var insertValues = {"group_name" : "ManagerSecondGroup"};
        try {
            var groupId = await dataShareHelper.insert(groupUri, insertValues);
            console.info("logMessage group_query_test_400: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            await GroupQuery();
            await deleteAll(groupUri, "group_query_test_400");
            done();
        } catch (error) {
            console.info("logMessage group_query_test_400: group insert error = " + error);
            done();
        }

        async function GroupQuery()
        {
            var resultColumns = [ "id", "group_name" ];
            let condition = new dataShare.DataSharePredicates();
            condition.greaterThan("id", "0");
            try {
                var resultSet = await dataShareHelper.query(groupUri, resultColumns, condition);
                console.info("logMessage group_query_test_400: resultSet.rowCount = " + resultSet.rowCount);
                expect(resultSet.rowCount == 1).assertTrue();
                resultSet.close();
            } catch (error) {
                console.info("group_query_test_400 resultSet query error = " + error);
                done();
            }
        }
    });

    /**
     * @tc.number  abnormal_group_insert_test_600
     * @tc.name    abnormal insert
     * @tc.desc    Function test
     */
    it("abnormal_group_insert_test_600", 0, async function(done) {
        console.info("---------logMessage abnormal_group_insert_test_600 is starting!----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        const errorUri = "datashare:///com.ohos.contactsdataability/contacts/groupssss";
        try {
            var groupId = await dataShareHelper.insert(errorUri, common.getProfileGroup());
            console.info("logMessage abnormal_group_insert_test_600: groupId = " + groupId);
            expect(groupId == -1).assertTrue();
            done();
        } catch (error) {
            console.info("logMessage abnormal_group_insert_test_600: group insert error = " + error);
            done();
        }
    });

    /**
     * @tc.number  abnormal_group_update_test_700
     * @tc.name    abnormal update
     * @tc.desc    Function test
     */
    it("abnormal_group_update_test_700", 0, async function(done) {
        console.info("---------logMessage abnormal_group_update_test_700 is starting!----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        try {
            var groupId = await dataShareHelper.insert(groupUri, common.getProfileGroup());
            console.info("logMessage abnormal_group_update_test_700: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            await GroupUpdate();
            await deleteAll(groupUri, "abnormal_group_update_test_700");
            done();
        } catch (error) {
            console.info("logMessage abnormal_group_update_test_700: group insert error = " + error);
            done();
        }

        async function GroupUpdate()
        {
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("id", groupId.toString());
            var updateValue = { "group_notesss" : "6666" }
            try {
                var updateCode = await dataShareHelper.update(groupUri, updateValue, condition);
                console.info("logMessage abnormal_group_update_test_700: updateCode = " + updateCode);
                expect(updateCode == -1).assertTrue();
                var map = common.getProfileUpdateGroupMap();
                map.set("id", groupId.toStirng());
                await groupsQuery(map, "abnormal_group_update_test_700");
            } catch (error) {
                console.info("logMessage abnormal_group_update_test_700: update error = " + error);
                done();
            }
        }
    });

    /**
     * @tc.number  abnormal_group_delete_test_800
     * @tc.name    abnormal delete
     * @tc.desc    Function test
     */
    it("abnormal_group_delete_test_800", 0, async function(done) {
        console.info("---------logMessage abnormal_group_delete_test_800 is starting!----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);
        try {
            var groupId = await dataShareHelper.insert(groupUri, common.getProfileGroup());
            console.info("logMessage abnormal_group_delete_test_800: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            await GroupDelete();
            await deleteAll(groupUri, "abnormal_group_delete_test_800");
            done();
        } catch (error) {
            console.info("logMessage abnormal_group_delete_test_800: group insert error = " + error);
            done();
        }
        async function GroupDelete()
        {
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("idss", groupId.toString());
            try {
                var deleteCode = await dataShareHelper.delete(groupUri, condition);
                console.info("logMessage abnormal_group_delete_test_800 : deleteCode = " + deleteCode);
                expect(deleteCode == -1).assertTrue();
                var map = common.getProfileUpdateGroupMap();
                map.set("id", groupId.toStirng());
                await groupsQuery(map, "abnormal_group_delete_test_800");
            } catch (error) {
                console.info("logMessage abnormal_group_delete_test_800 : delete error = " + error);
                done();
            }
        }
    });

    /**
     * @tc.number  abnormal_group_query_test_900
     * @tc.name    abnormal query
     * @tc.desc    Function test
     */
    it("abnormal_group_query_test_900", 0, async function(done) {
        console.info("------------logMessage abnormal_group_query_test_900 is starting!-----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);

        var insertValues = {"group_name" : "PersonnelDepartment"};
        try {
            var groupId = await dataShareHelper.insert(groupUri, insertValues);
            console.info("logMessage abnormal_group_query_test_900: groupId = " + groupId);
            expect(groupId > 0).assertTrue();
            await GroupQuery(dataShareHelper);
            await deleteAll(groupUri, "abnormal_group_query_test_900");
            done();
        } catch (error) {
            console.info("logMessage abnormal_group_query_test_900: group insert error = " + error);
            done();
        }

        async function GroupQuery(dataShareHelper)
        {
            var resultColumns = [ "id", "group_namesss" ];
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("id", groupId.toString());
            try {
                var resultSet = await dataShareHelper.query(groupUri, resultColumns, condition);
                console.info('abnormal_group_query_test_900 resultSet.goToFirstRow() = ' + resultSet.goToFirstRow());
                expect(resultSet.goToFirstRow() == false).assertTrue();
                resultSet.close();
            } catch (error) {
                console.info('abnormal_group_query_test_900 query error ' + error);
                done();
            }
        }
    });

    /**
     * @tc.number  group_insert_test_1000
     * @tc.name    Adding multiple groups
     * @tc.desc    Function test
     */
    it("group_insert_test_1000", 0, async function(done) {
        console.info("------------logMessage group_insert_test_1000 is starting!-----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);

        var insertValuesOne = {"group_name" : "test1000"};
        var insertValuesTwo = {"group_name" : "test1000"};
        var insertValuesThree = {"group_name" : "test1000"};
        var array = []
        array[0] = insertValuesOne;
        array[1] = insertValuesTwo;
        array[array_two] = insertValuesThree;
        try {
            var code = await dataShareHelper.batchInsert(groupUri, array);
            console.info("logMessage group_insert_test_1000: batchInsert code = " + code);
            expect(code == 0).assertTrue();
            await GroupQuery(dataShareHelper);
            await deleteAll(groupUri, "group_insert_test_1000");
            done();
        } catch (error) {
            console.info("logMessage group_insert_test_1000: group insert error = " + error);
            done();
        }

        async function GroupQuery(dataShareHelper)
        {
            var groupSize = 3;
            var resultColumns = [ "id", "group_name" ];
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("group_name", "test1000");
            try {
                var resultSet = await dataShareHelper.query(groupUri, resultColumns, condition);
                console.info('group_insert_test_1000 resultSet.rowCount = ' + resultSet.rowCount);
                expect(resultSet.rowCount == groupSize).assertTrue();
                resultSet.close();
            } catch (error) {
                console.info('group_insert_test_1000 query error ' + error);
                done();
            }
        }
    });

    /**
     * @tc.number  group_delete_test_1100
     * @tc.name    delete multiple groups
     * @tc.desc    Function test
     */
    it("group_delete_test_1100", 0, async function(done) {
        console.info("------------logMessage group_delete_test_1100 is starting!-----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);

        var insertValuesOne = {"group_name" : "test1100"};
        var insertValuesTwo = {"group_name" : "test1100"};
        var insertValuesThree = {"group_name" : "test1100"};
        var array = []
        array[0] = insertValuesOne;
        array[1] = insertValuesTwo;
        array[array_two] = insertValuesThree;
        try {
            var code = await dataShareHelper.batchInsert(groupUri, array);
            console.info("logMessage group_delete_test_1100: batchInsert code = " + code);
            expect(code == 0).assertTrue();
            await deleteAll(groupUri, "group_delete_test_1100");
            await GroupQuery(dataShareHelper);
            done();
        } catch (error) {
            console.info("logMessage group_delete_test_1100: group insert error = " + error);
            done();
        }

        async function GroupQuery(dataShareHelper)
        {
            var groupSize = 0;
            var resultColumns = [ "id", "group_name" ];
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("group_name", "test1100");
            try {
                var resultSet = await dataShareHelper.query(groupUri, resultColumns, condition);
                console.info('group_delete_test_1100  resultSet.rowCount = ' + resultSet.rowCount);
                expect(resultSet.rowCount == groupSize).assertTrue();
                resultSet.close();
            } catch (error) {
                console.info('group_delete_test_1100 query error ' + error);
                done();
            }
        }
    });

    /**
     * @tc.number  group_update_test_1200
     * @tc.name    update multiple groups
     * @tc.desc    Function test
     */
    it("group_update_test_1200", 0, async function(done) {
        console.info("------------logMessage group_update_test_1200 is starting!-----------");
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        console.info('logMessage get dataShareHelper success! dataShareHelper = ' + dataShareHelper);

        var insertValuesOne = {"group_name" : "test1200"};
        var insertValuesTwo = {"group_name" : "test1200"};
        var insertValuesThree = {"group_name" : "test1200"};
        var array = []
        array[0] = insertValuesOne;
        array[1] = insertValuesTwo;
        array[array_two] = insertValuesThree;
        try {
            var code = await dataShareHelper.batchInsert(groupUri, array);
            console.info("logMessage group_update_test_1200: batchInsert code = " + code);
            expect(code == 0).assertTrue();
            await GroupUpdateThree(dataShareHelper);
            await GroupQuery(dataShareHelper);
            await deleteAll(groupUri, "group_update_test_1200");
            done();
        } catch (error) {
            console.info("logMessage group_update_test_1200: group insert error = " + error);
            done();
        }

        async function GroupQuery(dataShareHelper)
        {
            var groupSize = 3;
            var resultColumns = [ "id", "group_name" ];
            let condition = new dataShare.DataSharePredicates();
            condition.equalTo("group_name", "test120000");
            try {
                var resultSet = await dataShareHelper.query(groupUri, resultColumns, condition);
                console.info("logMessage group_update_test_1200: resultSet.rowCount = " + resultSet.rowCount);
                expect(resultSet.rowCount == groupSize).assertTrue();
                resultSet.close();
            } catch (error) {
                console.info('group_update_test_1200 query error ' + error);
                done();
            }
        }
    });

    async function GroupUpdateThree(dataShareHelper)
    {
        let condition = new dataShare.DataSharePredicates();
        condition.equalTo("group_name", "test1200");
        var updateValue = { "group_name" : "test120000" }
        try {
            var updateCode = await dataShareHelper.update(groupUri, updateValue, condition);
            console.info("logMessage group_update_test_1200: updateCode = " + updateCode);
            expect(updateCode == 0).assertTrue();
        } catch (error) {
            console.info("logMessage group_update_test_1200: update error = " + error);
        }
    }

    afterAll(async function(done) {
        let dataShareHelper = dataShare.createDataShareHelper(URI_CONTACTS);
        let condition = new dataShare.DataSharePredicates();
        condition.notEqualTo("id", "0");
        try {
            var deleteCode = await dataShareHelper.delete(groupUri, condition);
            console.info("logMessage group_deleted : deleteCode = " + deleteCode);
            done();
        } catch (error) {
            console.info("logMessage group_deleted: group insert error = " + error);
            done();
        }
    });
})