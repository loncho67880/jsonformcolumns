import { Component } from '@angular/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { and, createAjv, Generate, isControl, optionIs, rankWith, schemaTypeIs, scopeEndsWith, Tester, UISchemaElement } from '@jsonforms/core';
import { CustomAutocompleteControlRenderer } from './custom.autocomplete';
import { DataDisplayComponent } from './data.control';
import { LangComponent } from './lang.control';
import uischemaAsset from '../assets/uischema.json';
import schemaAsset from '../assets/schema.json';
import dataAsset from './data';
import AJV from 'ajv';
import { parsePhoneNumber } from 'libphonenumber-js';
import { GenerateUiSchema } from './services/generatoruischema';
import { OptionsUIschema } from './models/OptionsUIschema';

const departmentTester: Tester = and(
  schemaTypeIs('string'),
  scopeEndsWith('department')
);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  renderers = [
    ...angularMaterialRenderers,
    { tester: rankWith(5, departmentTester), renderer: CustomAutocompleteControlRenderer },
    {
      renderer: DataDisplayComponent,
      tester: rankWith(
        6,
        and(
          isControl,
          scopeEndsWith('___data')
        )
      )
    },
    {
      renderer: LangComponent,
      tester: rankWith(
        6,
        and(
          isControl,
          optionIs('lang', true)
        )
      )
    },
  ];
  //uischema = uischemaAsset;
  //uischema = Generate.uiSchema(schemaAsset);
  uischema: UISchemaElement = this._generateUiSchema.generateDefaultUISchema(new OptionsUIschema({jsonSchema: schemaAsset, numColumns: 3, isGrouped: true, title: "Agrupación" }));
  //uischema = this._generateUiSchema.generateDefaultUISchema(schemaAsset, 3);
  //uischema = this._generateUiSchema.generateDefaultUISchema(schemaAsset);
  schema = schemaAsset;
  data = dataAsset;
  ajv = createAjv({
    schemaId: 'auto',
    allErrors: true,
    jsonPointers: true,
    errorDataPath: 'property'
  });
  constructor(private _generateUiSchema: GenerateUiSchema) {
    this.ajv.addFormat('time', '^([0-1][0-9]|2[0-3]):[0-5][0-9]$');
    this.ajv.addFormat('tel', maybePhoneNumber => {
      try {
        parsePhoneNumber(maybePhoneNumber, 'DE');
        return true;
      } catch (_) {
        return false;
      }
    });

    console.log(this.uischema);
  }
}
