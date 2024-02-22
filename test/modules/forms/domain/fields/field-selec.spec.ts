import { FieldSelect } from '@/modules/form/domain/fields/field-select';

describe('FieldSelect', () => {
  it('Deve criar um campo de seleção', () => {
    const field = new FieldSelect({
      label: 'Sexo',
      type: 'select',
      placeholder: 'Selecione seu sexo',
      options: [
        {
          label: 'Masculino',
          value: 'Masculino',
        },
        {
          label: 'Feminino',
          value: 'Feminino',
        },
      ],
    });

    expect(field.toJSON()).toEqual({
      id: field.id,
      label: 'Sexo',
      type: 'select',
      required: false,
      placeholder: 'Selecione seu sexo',
      entireLine: false,
      options: [
        {
          label: 'Masculino',
          value: 'Masculino',
          additionalFields: null,
        },
        {
          label: 'Feminino',
          value: 'Feminino',
          additionalFields: null,
        },
      ],
    });
  });

  it('Deve lançar uma exceção se o label não for informado', () => {
    expect(() => {
      new FieldSelect({
        label: '',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [
          {
            label: 'Masculino',
            value: 'Masculino',
          },
          {
            label: 'Feminino',
            value: 'Feminino',
          },
        ],
      });
    }).toThrow('Label é obrigatório');
  });

  it('Deve lancar uma exceção se as opções nao for informado', () => {
    expect(() => {
      new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [],
      });
    }).toThrow('Opções são obrigatórias');
  });

  it('Deve lançar uma exceção se tiver apenas uma opcao', () => {
    expect(() => {
      new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [
          {
            label: 'Masculino',
            value: 'Masculino',
          },
        ],
      });
    }).toThrow('Deve haver pelo menos duas opções');
  });

  describe('validateField', () => {
    it('Deve validar um campo de seleção', () => {
      const field = new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [
          {
            label: 'Masculino',
            value: 'Masculino',
          },
          {
            label: 'Feminino',
            value: 'Feminino',
          },
        ],
      });

      expect(() => {
        field.validateField({ Sexo: 'Masculino' });
      }).not.toThrow();
    });

    it('Deve lançar uma exceção se o campo for obrigatório e não for preenchido', () => {
      const field = new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [
          {
            label: 'Masculino',
            value: 'Masculino',
          },
          {
            label: 'Feminino',
            value: 'Feminino',
          },
        ],
        required: true,
      });

      expect(() => {
        field.validateField({ Sexo: '' });
      }).toThrow('Selecione uma opção');
    });

    it('Deve lançar uma exceção se a opção for inválida', () => {
      const field = new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [
          {
            label: 'Masculino',
            value: 'Masculino',
          },
          {
            label: 'Feminino',
            value: 'Feminino',
          },
        ],
      });

      expect(() => {
        field.validateField({ Sexo: 'Outro' });
      }).toThrow('O campo Sexo é inválido. Selecione uma opção válida');
    });
  });

  describe('additionalFields', () => {
    it('Deve adicionar campos adicionais', () => {
      const field = new FieldSelect({
        label: 'Tipo de Pessoa',
        type: 'select',
        placeholder: 'Selecione o tipo de pessoa',
        options: [
          {
            label: 'Pessoa Física',
            value: 'PF',
            additionalFields: [
              {
                label: 'CPF',
                type: 'text',
                required: true,
                placeholder: 'Digite seu CPF',
              },
            ],
          },
          {
            label: 'Pessoa Jurídica',
            value: 'PJ',
            additionalFields: [
              {
                label: 'CNPJ',
                type: 'text',
                required: true,
                placeholder: 'Digite seu CNPJ',
              },
            ],
          },
        ],
      });

      const result = field.validateField({
        'Tipo de Pessoa': 'PF',
        CPF: '12345678901',
      });

      expect(result).toBeUndefined();
    });

    it('Deve lançar uma exceção se o campo adicional for obrigatório e não for preenchido', () => {
      const field = new FieldSelect({
        label: 'Tipo de Pessoa',
        type: 'select',
        placeholder: 'Selecione o tipo de pessoa',
        options: [
          {
            label: 'Pessoa Física',
            value: 'PF',
            additionalFields: [
              {
                label: 'CPF',
                type: 'text',
                required: true,
                placeholder: 'Digite seu CPF',
              },
            ],
          },
          {
            label: 'Pessoa Jurídica',
            value: 'PJ',
            additionalFields: [
              {
                label: 'CNPJ',
                type: 'text',
                required: true,
                placeholder: 'Digite seu CNPJ',
              },
            ],
          },
        ],
      });

      expect(() => {
        field.validateField({ 'Tipo de Pessoa': 'PF' });
      }).toThrow('O campo CPF é obrigatório');
    });

    it('Deve validar os campos adicionais', () => {
      const field = new FieldSelect({
        label: 'País',
        type: 'select',
        placeholder: 'Selecione o seu país',
        options: [
          {
            label: 'Brasil',
            value: 'BRA',
            additionalFields: [
              {
                label: 'Estado',
                type: 'select',
                required: true,
                placeholder: 'Selecione o seu estado',
                options: [
                  {
                    label: 'São Paulo',
                    value: 'SP',
                    additionalFields: [
                      {
                        label: 'Cidade',
                        type: 'select',
                        required: true,
                        placeholder: 'Selecione a sua cidade',
                        options: [
                          {
                            label: 'São Paulo',
                            value: 'SP-CITY',
                            additionalFields: [
                              {
                                label: 'Bairro',
                                type: 'text',
                                required: true,
                                placeholder: 'Digite o seu bairro',
                              },
                            ],
                          },
                          {
                            label: 'Campinas',
                            value: 'CP',
                            additionalFields: [
                              {
                                label: 'Bairro',
                                type: 'text',
                                required: true,
                                placeholder: 'Digite o seu bairro',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: 'Rio de Janeiro',
                    value: 'RJ',
                    additionalFields: [
                      {
                        label: 'Cidade',
                        type: 'select',
                        required: true,
                        placeholder: 'Selecione a sua cidade',
                        options: [
                          {
                            label: 'Rio de Janeiro',
                            value: 'RJ',
                          },
                          {
                            label: 'Niterói',
                            value: 'NT',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            label: 'Estados Unidos',
            value: 'USA',
            additionalFields: [
              {
                label: 'Estado',
                type: 'select',
                required: true,
                placeholder: 'Selecione o seu estado',
                options: [
                  {
                    label: 'Texas',
                    value: 'TX',
                    additionalFields: [
                      {
                        label: 'Cidade',
                        type: 'select',
                        required: true,
                        placeholder: 'Selecione a sua cidade',
                        options: [
                          {
                            label: 'Houston',
                            value: 'HOU',
                          },
                          {
                            label: 'Dallas',
                            value: 'DAL',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: 'Califórnia',
                    value: 'CA',
                    additionalFields: [
                      {
                        label: 'Cidade',
                        type: 'select',
                        required: true,
                        placeholder: 'Selecione a sua cidade',
                        options: [
                          {
                            label: 'Los Angeles',
                            value: 'LA',
                          },
                          {
                            label: 'San Francisco',
                            value: 'SF',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const result = field.validateField({
        País: 'BRA',
        Estado: 'SP',
        Cidade: 'SP-CITY',
        Bairro: 'Vila Mariana',
      });

      expect(result).toBeUndefined();
    });
  });
});
