/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import reactor from './reactor';
import helpers from './helpers';

// AuditEvents
// https://developer.adobelaunch.com/api/audit_events/
describe('AuditEvent API', function() {
  var theProperty;
  var theAdapter;

  // beforeAll(async function() {
  //   try {
  //     theProperty = await helpers.createTestProperty('AuditEvent-Testing Base');
  //     if (!theProperty) fail('could not create test property');

  //     // create an AuditEvent trail by doing some operations on the property
  //     theAdapter = await helpers.createTestAdapter(theProperty.id, 'temp');
  //     if (!theProperty) fail('could not create test adapter');
  //     await reactor.deleteAdapter(theAdapter.id);
  //     const response = await reactor.updateProperty({
  //       attributes: {
  //         name: theProperty.attributes.name.replace('Base', 'Updated'),
  //       },
  //       id: theProperty.id,
  //       type: 'properties',
  //     });
  //   } catch (error) {
  //     helpers.specName = 'AuditEvent beforeAll';
  //     helpers.reportError(error);
  //   }
  // });

  // afterAll(async function() {
  //   if (theProperty && theProperty.id) {
  //     await reactor.deleteProperty(theProperty.id);
  //   }
  // });

  // get all the AuditEvents for the identified Property
  async function auditEventsForProperty(propertyId) {
    /*eslint-disable camelcase*/
    const theAuditEvents = [];
    let pagination = { next_page: 1 };
    do {
      const page = await reactor.listAuditEvents({
        'filter[property]': 'EQ ' + theProperty.id,
        'page[number]': pagination.next_page,
        'page[size]': 100
      });
      const auditEvents = page.data;
      auditEvents.forEach(ae => {
        if (
          ae &&
          ae.relationships &&
          ae.relationships.property &&
          ae.relationships.property.data &&
          ae.relationships.property.data.id === theProperty.id
        ) {
          ae.attributes.entity = JSON.parse(ae.attributes.entity);
          theAuditEvents.push(ae);
        }
      });
      pagination = page && page.meta && page.meta.pagination;
    } while (pagination.next_page);
    return theAuditEvents;
    /*eslint-enable camelcase*/
  }

  // Get an AuditEvent
  // https://developer.adobelaunch.com/api/AuditEvents/fetch/
  helpers
    .xit('gets an AuditEvent', async function() {
      //TODO: test getAuditEvent
      // This test of getAuditEvent needs to be re-enabled once we fix
      // [DTM-11356 "Cannot list audit events after page
      // 1000"](https://jira.corp.adobe.com/browse/DTM-11356)
      // and
      // [DTM-10098]("/audit_events can be filtered by
      // property"](https://jira.corp.adobe.com/browse/DTM-10098)
      if (!theProperty) return;
      const events = await auditEventsForProperty(theProperty.id);
      const auditIds = events.map(resource => resource.id);

      const response = await reactor.getAuditEvent(auditIds[0]);
      const theAuditEvent = response.data;
      expect(theAuditEvent.relationships.property.data.id).toBe(theProperty.id);
      expect([
        'property.created',
        'property.updated',
        'adapter.created',
        'adapter.deleted'
      ]).toContain(theAuditEvent.attributes.type_of);
    })
    .pend('blocked by DTM-11356 and DTM-10098');

  // List AuditEvents for owned Properties
  // https://developer.adobelaunch.com/api/AuditEvents/list/
  helpers
    .xit('lists all AuditEvents', async function() {
      //TODO: test listAuditEvents
      // This test of listAuditEvents needs to be re-enabled once we fix
      // [DTM-11356 "Cannot list audit events after page
      // 1000"](https://jira.corp.adobe.com/browse/DTM-11356)
      // and
      // [DTM-10098]("/audit_events can be filtered by
      // property"](https://jira.corp.adobe.com/browse/DTM-10098)
      if (!theProperty) return;
      const events = await auditEventsForProperty(theProperty.id);
      function findAE(type_of, entityId) {
        return events.find(ae => {
          const attrs = ae.attributes;
          return attrs.type_of === type_of && attrs.entity.data.id === entityId;
        });
      }

      var createdProperty = findAE('property.created', theProperty.id);
      expect(createdProperty).toBeDefined();

      var updatedProperty = findAE('property.updated', theProperty.id);
      expect(updatedProperty).toBeDefined();

      var createdAdapter = findAE('adapter.created', theAdapter.id);
      expect(createdAdapter).toBeDefined();

      var deletedAdapter = findAE('adapter.deleted', theAdapter.id);
      expect(deletedAdapter).toBeDefined();
    })
    .pend('blocked by DTM-11356 and DTM-10098');
});
