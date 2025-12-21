import { render, screen } from '@testing-library/react';
import ColumnMenu from '../components/ColumnMenu';

const defaultProps = {
  column: {
    ColumnId: '1',
    Name: 'Test Column',
    EmojiIcon: 'star',
    Description: '',
    NameVisible: true,
    Options: [],
    DoneTags: [],
    TagColors: {},
    CheckboxColor: '',
    Type: 'text',
    Width: '200',
  },
  handleDeleteColumn: jest.fn(),
  onClose: jest.fn(),
  onRename: jest.fn(),
  onChangeIcon: jest.fn(),
  onChangeDescription: jest.fn(),
  onToggleTitleVisibility: jest.fn(),
  onChangeOptions: jest.fn(),
  onMoveUp: jest.fn(),
  onMoveDown: jest.fn(),
  canMoveUp: true,
  canMoveDown: true,
  darkMode: false,
  onChangeWidth: jest.fn(),
  onChangeCheckboxColor: jest.fn(),
};

describe('ColumnMenu', () => {
  test('renders with column name and close button', () => {
    render(<ColumnMenu {...defaultProps} />);

    // перевірка заголовку
    expect(screen.getByText('Column Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Column')).toBeInTheDocument();

    // перевірка кнопки закриття
    expect(
      screen.getByRole('button', { name: /close column settings/i }),
    ).toBeInTheDocument();
  });
});
